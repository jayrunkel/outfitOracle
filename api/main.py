
from sentence_transformers import SentenceTransformer
from flask import Flask, Response, request, jsonify
from PIL import Image
from vectorize import vectorize
from search_progress import search_status
import prompt
from bson import binary, ObjectId
import threading
import io
import pymongo
import datetime
'''
kill -9 $(lsof -t -i:5000)
'''

app = Flask(__name__)

preTrainedModelName = "clip-ViT-L-14"

# Load CLIP model
model = SentenceTransformer(preTrainedModelName)

# MongoDB connection
mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=1&readPreference=primary&compressors=zlib"
db = "GucciGang"


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/upload", methods=["POST"])
def upload_file():
    if 'image' in request.files:
        image_file = request.files['image']

        # Compress and process the image
        img = Image.open(image_file)
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        compressed_image_io = io.BytesIO()
        img.save(compressed_image_io, format='JPEG', quality=85)
        compressed_image_io.seek(0)
        image_binary = binary.Binary(compressed_image_io.getvalue())

        # create a version that's 256px tall and write it to image_binary_256
        img_256 = img.resize((int(img.width * 256 / img.height), 256))
        compressed_image_io_256 = io.BytesIO()
        img_256.save(compressed_image_io_256, format='JPEG', quality=85)
        compressed_image_io_256.seek(0)
        image_binary_256 = binary.Binary(compressed_image_io_256.getvalue())

        # create a version that's 128px tall and write it to image_binary_128
        img_128 = img.resize((int(img.width * 128 / img.height), 128))
        compressed_image_io_128 = io.BytesIO()
        img_128.save(compressed_image_io_128, format='JPEG', quality=50)
        compressed_image_io_128.seek(0)
        image_binary_128 = binary.Binary(compressed_image_io_128.getvalue())

        # Timestamp and filename
        timestamp = datetime.datetime.utcnow()
        filename = image_file.filename

        # Save to MongoDB
        connection = pymongo.MongoClient(mongo_uri)
        imageCollection = connection[db]['userUploads']
        document = {'image_name': filename,
                    'image_binary': image_binary, 'image_binary_256': image_binary_256, 'image_binary_128': image_binary_128, 'uploaded_timestamp': timestamp}
        insert_result = imageCollection.insert_one(document)
        image_id = insert_result.inserted_id

        # Start a background task for vectorization
        threading.Thread(target=async_vectorize, args=(
            image_id, io.BytesIO(image_binary))).start()

        imageCollection.update_one({'_id': image_id}, {
            '$set': {'image_link': "http://127.0.0.1:5000/image/"+str(image_id)}})

        return {'_id': str(image_id), 'image_name': filename}, 200
    else:
        return {'status': 'No image found'}, 400


def async_vectorize(document_id, image_stream):
    vector = vectorize(image_stream)
    # Update the MongoDB document
    connection = pymongo.MongoClient(mongo_uri)
    imageCollection = connection[db]['userUploads']
    imageCollection.update_one({'_id': ObjectId(document_id)}, {
                               '$set': {'image_vector': vector}})


@app.route("/image/<_id>", methods=["GET"])
def get_image(_id):
    # _id = request.args.get('_id')

    if not _id:
        return "Missing _id parameter", 400

    try:
        # Convert string _id to ObjectId
        object_id = ObjectId(_id)
    except:
        return "Invalid _id", 400

    connection = pymongo.MongoClient(mongo_uri)
    imageCollection = connection[db]['userUploads']

    # Retrieve the document by _id
    document = imageCollection.find_one({'_id': object_id})
    if not document:
        return "No image found with given _id", 404

    image_binary = document['image_binary']

    # Serve the image
    return Response(image_binary, mimetype='image/jpeg')


@app.route("/prompt", methods=["POST"])
def send_prompt():
    return jsonify(prompt.prompt(request))


@app.route("/search_progress", methods=["POST"])
def search_progress():
    data = request.get_json()
    return jsonify(search_status(userPrompt=data['prompt'], customerId=data['customerId'], search_Id=data['search_Id'], number=data['number']))


if __name__ == '__main__':
    app.run(debug=True)

'''@app.route("/post", methods=["POST"])
def post():
    data = request.get_json()
    print(data)
    return jsonify(data)


@app.route("/hello/<name>")
def hello_name(name):
    return f"Hello {name}!"

# get request with query string


@app.route("/hello")
def hello():
    name = request.args.get("name", "")
    if name == "":
        return "Hello, World!"
    else:
        return f"Hello {name}!"


'''
