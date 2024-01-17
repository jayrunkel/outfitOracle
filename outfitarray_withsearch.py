from sentence_transformers import SentenceTransformer, util
from PIL import Image
import pymongo
from bson import json_util
import json
from datetime import datetime, timedelta

preTrainedModelName = "clip-ViT-L-14"
mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=majority"
db = "GucciGang"
collection = "OutfitOracle"


# List of input arrays of outfit attributes
outfit_arrays_list = [
    [
        "Black Tuxedo", "White Dress Shirt", "Black Bow Tie", "Black Dress Shoes"
    ],
    [
        "White Watch", "Sequin Dress", "Black Heels", "White Purse"
    ],
    [
        "Grey Tuxedo", "Sequin Dress", "Black Heels", "White Purse"
    ],
    # Add more arrays of outfit attributes as needed
]


# Connect to MongoDB
connection = pymongo.MongoClient(mongo_uri)
product_collection = connection[db][collection]

# Load CLIP model
model = SentenceTransformer(preTrainedModelName)

results = []

# Generate a unique search ID
search_id = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")

for outfit_attributes in outfit_arrays_list:
    outfit_results = []

    for attribute in outfit_attributes:
        # Encode each outfit attribute array
        encoded = model.encode(json.dumps(attribute)).tolist()

        vector_query = encoded
        pipeline = [
            {
                "$search": {
                    "index": "default",
                    "knnBeta": {
                        "vector": vector_query,
                        "path": "imageVector",
                        "k": 10
                    }
                }
            },
            {
                "$project": {
                    "imageVector": {"$slice": ["$imageVector", 5]},
                    "imageFile": 1,
                    "productDisplayName": 1,
                    "price": 1,
                    "discountPercentage": 1,
                    "averageRating": 1,
                    "searchID": 1,
                    "_id": 0,
                    "link": 1,
                    'score': {
                        '$meta': 'searchScore'
                    }
                }
            }
        ]

        # Execute the pipeline
        outfit_results.append(list(product_collection.aggregate(pipeline)))

    # Append results for this outfit array to the list
    results.append({'outfit_array': outfit_attributes,
                   'outfit_results': outfit_results, 'searchID': search_id})

# Convert results to JSON
json_result = json.dumps({'results': results}, default=json_util.default)

# Save the results in a temporary MongoDB collection
collection_name = "ProductResults"

# Connect to MongoDB
db = connection[db]
collection = db[collection_name]

# Insert the outfit results directly into the MongoDB collection
collection.insert_many(results)

# Create index for expiration time
collection.create_index('expiration_time')

print(json_result)
