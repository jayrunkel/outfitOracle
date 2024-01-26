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

    match (data["customerProfile"]["gender"]).lower():
        case "male" | "m" | "man":
            gender = "Men"
        case "female" | "w" | "woman":
            gender = "Women"
        case "boy":
            gender = "Boys"
        case "girl":
            gender = "Girls"
        case _:
            gender = "Unisex"

    for outfit_attributes in outfit_arrays_list:

        # pprint.pprint(outfit_attributes)

        outfit_results = []
        perfect = []

        # pass articles and gpt_response
        prefilters = generate_filters(
            articles=outfit_attributes['outfit_articles'],
            description=outfit_attributes['gpt_response']
        )

        print(prefilters)

        filter_errors = 0

        for attribute in outfit_attributes['outfit_articles']:
            # Encode each outfit attribute array
            encoded = model.encode(json.dumps(attribute)).tolist()

            vector_query = encoded

            gender_filter = {
                'compound': {
                    'must': [
                        {'compound':
                            {'should': []}
                         }
                    ],
                    'should': [],
                    'filter': [{
                        'compound': {
                            'filter': [
                                {
                                    'compound': {
                                        'should': [
                                            {'text': {
                                                'query': gender,
                                                'path': 'gender'
                                            }
                                            }, {'text': {
                                                'query': 'Unisex',
                                                'path': 'gender'
                                            }
                                            }]}}]}}]
                }}

            try:
                prefilter = json.loads(prefilters)[attribute]
                prefilter_formatted = gender_filter
                prefilter_formatted["compound"]["should"] = prefilter

                # Create a list to hold items that need to be moved to 'must'
                must_items = []
                # Identify items that need to be moved from 'should' to 'must'
                for item in prefilter_formatted["compound"]["should"]:
                    if "articleType" in item["text"]["path"]:
                        must_items.append(item)

                # Add identified items to 'must'
                prefilter_formatted["compound"]["must"][0]["compound"]["should"].extend(
                    must_items)
                # Remove the moved items from 'should'
                prefilter_formatted["compound"]["should"] = [
                    item for item in prefilter_formatted["compound"]["should"]
                    if item not in must_items
                ]
                # Now prefilter_formatted is correctly formatted
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print("Prefilter Error")
                prefilter_formatted = gender_filter
                del prefilter_formatted["compound"]["should"]
                del prefilter_formatted["compound"]["must"]
            except KeyError as e:
                print(f"Key error: {e}")
                print("Prefilter Error")
                prefilter_formatted = gender_filter
                del prefilter_formatted["compound"]["should"]
                del prefilter_formatted["compound"]["must"]
            except:
                # If there is no prefilter, set it to an empty dictionary
                print("Prefilter Error")
                prefilter_formatted = gender_filter
                del prefilter_formatted["compound"]["should"]
                del prefilter_formatted["compound"]["must"]

            pipeline = [
                {
                    "$search": {
                        "index": "default",
                        "knnBeta": {
                            "vector": vector_query,
                            "path": "imageVector",
                            "k": 100,
                            "filter": prefilter_formatted
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
                        "masterCategory": 1,
                        "_id": 1,
                        "link": 1,
                        'score': {
                            '$meta': 'searchScore'
                        }
                    }
                },
                {
                    "$sort": {
                        "score": -1
                    }
                },
                {
                    "$limit": 10
                }
            ]

            # Execute the pipeline
            try:
                outfit_results.append(
                    list(product_collection.aggregate(pipeline)))
                perfect.append(attribute)
            except Exception as e:
                filter_errors += 1
                print(prefilter_formatted)
                # remove filter
                del pipeline[0]["$search"]["knnBeta"]["filter"]
                outfit_results.append(
                    list(product_collection.aggregate(pipeline)))

        # Loop through outfit_attributes['outfit_articles'] incrementally... if an item is present in perfect, add a . to the end of the item and update outfit_attributes['outfit_articles']
        for i, item in enumerate(outfit_attributes['outfit_articles']):
            if item in perfect:
                outfit_attributes['outfit_articles'][i] = item + "."

        if filter_errors == 0:
            outfit_attributes['outfit_name'] = outfit_attributes['outfit_name'] + \
                "."

        # Append results for this outfit array to the list
        results.append({'outfit_array': outfit_attributes,
                        'outfit_results': outfit_results,
                        'searchID': data['searchId'],
                        'dalle_image': outfit_attributes['dalle_image'],
                        'filter_errors': filter_errors,
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

    # print(json_result)


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
