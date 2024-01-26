'''
Take a base64 encoded image and save it to MongoDB, then start a background task to vectorize it
'''
import io
import datetime
import threading
from PIL import Image
from bson import binary
import pymongo
from bson.objectid import ObjectId
import base64
from vectorize import vectorize
from describe_image import get_dense_captions


def save_img(image, userId):

    # MongoDB connection
    mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=1&readPreference=primary&compressors=zlib"
    db = "GucciGang"

    image = image.split(',')[1]
    image = base64.b64decode(image)
    image = Image.open(io.BytesIO(image))
    image = image.convert('RGB')
    compressed_image_io = io.BytesIO()
    image.save(compressed_image_io, format='JPEG', quality=85)
    compressed_image_io.seek(0)
    image_binary = binary.Binary(compressed_image_io.getvalue())

    # create a version that's 256px tall and write it to image_binary_256
    img_256 = image.resize((int(image.width * 256 / image.height), 256))
    compressed_image_io_256 = io.BytesIO()
    img_256.save(compressed_image_io_256, format='JPEG', quality=85)
    compressed_image_io_256.seek(0)
    image_binary_256 = binary.Binary(compressed_image_io_256.getvalue())

    # create a version that's 128px tall and write it to image_binary_128
    img_128 = image.resize((int(image.width * 128 / image.height), 128))
    compressed_image_io_128 = io.BytesIO()
    img_128.save(compressed_image_io_128, format='JPEG', quality=50)
    compressed_image_io_128.seek(0)
    image_binary_128 = binary.Binary(compressed_image_io_128.getvalue())

    # Timestamp and filename
    timestamp = datetime.datetime.utcnow()

    # Save to MongoDB
    connection = pymongo.MongoClient(mongo_uri)
    imageCollection = connection[db]['userUploads']
    document = {'userId': userId,
                'image_binary': image_binary, 'image_binary_256': image_binary_256, 'image_binary_128': image_binary_128, 'uploaded_timestamp': timestamp}
    insert_result = imageCollection.insert_one(document)
    image_id = insert_result.inserted_id

    # Start a background task for vectorization
    threading.Thread(target=async_vectorize, args=(
        image_id, io.BytesIO(image_binary))).start()

    caption = get_dense_captions(str(image_id))

    imageCollection.update_one({'_id': image_id}, {
        '$set': {'image_link': "http://127.0.0.1:5000/image/"+str(image_id), 'caption': caption}})

    caption = get_dense_captions(str(image_id))

    return {'_id': str(image_id), 'caption': caption}


def async_vectorize(document_id, image_stream):
    # MongoDB connection
    mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=1&readPreference=primary&compressors=zlib"
    db = "GucciGang"

    vector = vectorize(image_stream)
    # Update the MongoDB document
    connection = pymongo.MongoClient(mongo_uri)
    imageCollection = connection[db]['userUploads']
    imageCollection.update_one({'_id': ObjectId(document_id)}, {
                               '$set': {'image_vector': vector}})
