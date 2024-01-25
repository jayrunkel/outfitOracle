from sentence_transformers import SentenceTransformer, util
from PIL import Image
import pymongo
from bson import json_util
from bson import Binary
import uuid
import json
from datetime import datetime, timedelta
import pprint
from pre_filters import generate_filters
import ast


def search_db(data):
    preTrainedModelName = "clip-ViT-L-14"
    mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=majority"
    db = "GucciGang"
    collection = "OutfitOracle"

    # List of input arrays of outfit attributes
    outfit_arrays_list = [item for item in data['outfits']]

    # Connect to MongoDB
    connection = pymongo.MongoClient(mongo_uri)
    product_collection = connection[db][collection]

    # Load CLIP model
    model = SentenceTransformer(preTrainedModelName)

    results = []

    for outfit_attributes in outfit_arrays_list:

        # pprint.pprint(outfit_attributes)

        outfit_results = []

        # pass articles and gpt_response
        '''prefilters = generate_filters(
            articles=outfit_attributes['outfit_articles'],
            description=outfit_attributes['gpt_response']
        )'''

        # print(prefilters)

        for attribute in outfit_attributes['outfit_articles']:
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
                        },
                        # "filter": {prefilters[attribute]}
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
                        "masterCategory": 1,
                        "_id": 1,
                        "link": 1,
                        'score': {
                            '$meta': 'searchScore'
                        }
                    }
                }
            ]

            # Execute the pipeline
            try:
                outfit_results.append(
                    list(product_collection.aggregate(pipeline)))
            except Exception as e:
                print(json.dumps(prefilters[attribute], indent=2))
                # remove filter
                del pipeline[0]["$search"]["filter"]
                outfit_results.append(
                    list(product_collection.aggregate(pipeline)))

        # Append results for this outfit array to the list
        results.append({'outfit_array': outfit_attributes,
                        'outfit_results': outfit_results,
                        'searchID': data['searchId'],
                        'dalle_image': outfit_attributes['dalle_image']
                        })

        # pprint.pprint(results)

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


test = [
    {
        "outfit_articles": ["magenta blazer", "black dress pants", "white dress shirt", "silver stilettos", "gold watch", "silver necklace"],
        "attribute_extract": {
            "gender": "Female",
            "masterCategory": "Dresses",
            "subCategory": "Office Wear",
            "articleType": ["Blazers", "Pants", "Shirts"],
            "baseColour": ["Magenta", "Black", "White"],
            "season": "Spring",
            "usage": "Formal",
            "price": 589.95,
            "averageRating": 4.92
        },
        "gpt_response": "I absolutely love this outfit! The magenta blazer gives a professional look while showing off personality. The black dress pants and white dress shirt keep the attention on the blazer. Plus, the gold watch and silver necklace make a nice jewelry statement. Sophisticated and stylish, this outfit is a perfect choice for showing off at a conference.",
        "dalle_prompt": "Modify this image with a magenta blazer, black dress pants, white dress shirt, silver stilettos, gold watch, and silver necklace."
    },
    {
        "outfit_articles": ["magenta blazer", "black leather pants", "white tank top", "black ankle boots", "gold hoop earrings", "gold bracelet"],
        "attribute_extract": {
            "gender": "Female",
            "masterCategory": "Tops",
            "subCategory": "Casual Tops",
            "articleType": ["Blazers", "Pants", "Tops"],
            "baseColour": ["Magenta", "Black", "White"],
            "season": "Fall",
            "usage": "Casual",
            "price": 878.46,
            "averageRating": 4.67
        },
        "gpt_response": "For a more edgy and fashionable look, pair the magenta blazer with some black leather pants and a simple white tank top. The black ankle boots add a touch of sophistication while the gold hoop earrings and bracelet add some glamour. This outfit is perfect for a young, stylish professional in the tech industry.",
        "dalle_prompt": "Modify this image with a magenta blazer, black leather pants, white tank top, black ankle boots, gold hoop earrings, and gold bracelet."
    },
    {
        "outfit_articles": ["magenta blazer", "black leather skirt", "blue silk blouse", "silver pumps", "silver statement necklace", "silver bracelet"],
        "attribute_extract": {
            "gender": "Female",
            "masterCategory": "Tops",
            "subCategory": "Evening Tops",
            "articleType": ["Blazers", "Skirts", "Tops"],
            "baseColour": ["Magenta", "Black", "Blue"],
            "season": "Summer",
            "usage": "Formal",
            "price": 1850.80,
            "averageRating": 4.80
        },
        "gpt_response": "For a more sophisticated and glamorous look, pair the magenta blazer with a black leather skirt and blue silk blouse. The silver pumps and statement necklace add some shine while the silver bracelet brings it all together. This outfit is perfect for a sophisticated and fashion-forward tech professional.",
        "dalle_prompt": "Modify this image with a magenta blazer, black leather skirt, blue silk blouse, silver pumps, silver statement necklace, and silver bracelet."
    }
]

# search_db(test)
