import os
import openai
import json
import pprint
import pymongo
import logging
import uuid
from prompt_img import generate_dalle
from search_db import search_db
import re
import threading


def generate_filters(articles, description):

    openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
    # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_base = "https://outfitoracle.openai.azure.com/"
    openai.api_type = 'azure'
    openai.api_version = "2023-09-15-preview"  # this might change in the future

    logging.basicConfig(level=logging.INFO)

    currentFilters = json.dumps(get_filters())

    # for each article, create a json object with the article as the key and a blank object as the value
    articles_object = {}
    for article in articles:
        articles_object[article] = {}

    articles_object = json.dumps(articles_object)

    original_prompt = f"""
    You are a MongoDB Analyst. You are tasked with building the filter option of an MQL stage in JSON format to pass to an API. The first character of your response should be "{" and the last should be "}"... there should not be any other character outside of the json object.\n
    
    I'm trying to filter products in a MongoDB databass by their attributes to match this outfit description: \n
    {description} \n
    
    Update the `output` variable below and see if you can build a filter for each of the articles (object key) to help us narrow down the right product for the above outfit description, only using the `available filter options` below. \n
    
    - You must be very sure, or you should not choose that value. If the filter is redundant or doesn't match the article and description, don't create it.\n
    - The output should be a single JSON object with each article as its own key and the value will be the MQL filter as a json object. \n
    - The filter should be a JSON object of one or multiple filters that use only these options: $eq, $in. \n
    - I never want to see masterCategory subCategory articleType in the same filter. Only the most encompasing filter for the article should be used. \n
    - There must be a category or article type at the minimum, and match color best you can, or us $in to get similar colors \n
    
    If your response is not valid JSON, I will not be able to use it. Do not include the object name. \n
    
    Is the first character of your response "{" and the last "}"? If not, I will remove all of your GPUs and donate them to crypto bros for their mining rigs. \n
    output:
    ```json
    {articles_object}``` \n
    
    available filter options:
    ```json
    {currentFilters}``` \n
    
    """
    print("attempting to generate filters")
    try:
        # Send a completion call to generate an answer
        response = openai.Completion.create(
            engine="outfit-oracle-gpt-turbo-instruct",
            prompt=original_prompt,
            max_tokens=4000,
        )

        # Extract and print text response
        response_text = response['choices'][0]['text'].strip()

        try:
            json.loads(response_text)
            # try: read each article as a key in the response to make sure all articles are present
            try:
                for article in articles:
                    if article not in json.loads(response_text):
                        raise Exception(
                            f"Article {article} was not found in the response")
            except Exception as e:
                response_text = generate_filters(articles, description)

        except json.JSONDecodeError:

            if response_text[0] != "{" or response_text[-1] != "}":

                # strip anything outside of the json object

                response_text = re.sub(r'[^{,}]+', '', response_text)
                response_text = response_text.replace(",,", ",")

            try:
                json.loads(response_text)
            except json.JSONDecodeError:
                # ask openai to fix the json

                prompt = f"""fix the json and remove any comments: {response_text}"""

                response = openai.Completion.create(
                    engine="outfit-oracle-gpt-turbo-instruct",
                    prompt=prompt,
                    max_tokens=4000
                )

                response_text = response['choices'][0]['text'].strip()

                try:
                    json.loads(response_text)
                    for article in articles:
                        if article not in json.loads(response_text):
                            raise Exception(
                                f"Article {article} was not found in the response")
                except Exception as e:
                    response_text = generate_filters(articles, description)

    except Exception as e:
        logging.warning("An error occurred:", str(e))

    return (response_text)


def get_filters():

    mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=majority"
    db = "GucciGang"
    collection = "OutfitOracle"

    pipeline = [
        {
            '$group': {
                '_id': None,
                'gender': {
                    '$addToSet': '$gender'
                },
                'masterCategory': {
                    '$addToSet': '$masterCategory'
                },
                'subCategory': {
                    '$addToSet': '$subCategory'
                },
                'articleType': {
                    '$addToSet': '$articleType'
                },
                'baseColour': {
                    '$addToSet': '$baseColour'
                },
                'season': {
                    '$addToSet': '$season'
                },
                'usage': {
                    '$addToSet': '$usage'
                }
            }
        }, {
            '$project': {
                '_id': 0,
                'gender': 1,
                'masterCategory': 1,
                'subCategory': 1,
                'articleType': 1,
                'baseColour': 1,
                'season': 1,
                'year': 1,
                'usage': 1
            }
        }
    ]

    connection = pymongo.MongoClient(mongo_uri)
    OutfitOracle = connection[db][collection]

    currentFilters = list(OutfitOracle.aggregate(pipeline))

    return currentFilters


description = "Stealth and style come together in this suave spy outfit. The black fedora and trench coat give off a mysterious vibe, while the gray turtleneck adds a touch of sophistication. The black combat boots and gloves are practical for any mission. Top it off with a silver watch for a touch of luxury."

articles = [
    "black fedora",
    "black sunglasses",
    "black trench coat",
    "gray turtleneck sweater",
    "black combat boots",
    "black gloves",
    "black dress pants",
    "silver watch"
]

response = {"black fedora": {"articleType": {"$eq": "Fedora"}, "baseColour": {"$eq": "Black"}},
            "black sunglasses": {"articleType": {"$eq": "Sunglasses"}, "baseColour": {"$eq": "Black"}},
            "black trench coat": {"articleType": {"$eq": "Overcoat"}, "baseColour": {"$eq": "Black"}, "season": {"$in": ["Winter", "Fall"]}},
            "gray turtleneck sweater": {"articleType": {"$eq": "Sweater"}, "baseColour": {"$eq": "Gray"}, "usage": {"$in": ["Smart Casual", "Party"]}},
            "black combat boots": {"articleType": {"$eq": "Boots"}, "baseColour": {"$eq": "Black"}, "usage": {"$eq": "Casual"}},
            "black gloves": {"articleType": {"$eq": "Gloves"}, "baseColour": {"$eq": "Black"}},
            "black dress pants": {"articleType": {"$eq": "Pants"}, "baseColour": {"$eq": "Black"}, "usage": {"$eq": "Formal"}},
            "silver watch": {"articleType": {"$eq": "Watch"}, "baseColour": {"$eq": "Silver"}, "usage": {"$in": ["Formal", "Smart Casual"]}}}

print(generate_filters(articles, description))
