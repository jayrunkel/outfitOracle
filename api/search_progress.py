import os
import openai
import json
import pprint
import pymongo
import logging
import uuid
import re
import threading


def search_status(userPrompt, customerId, imageName, search_Id, number):
    openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
    # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_base = "https://outfitoracle.openai.azure.com/"
    openai.api_type = 'azure'
    openai.api_version = "2023-09-15-preview"  # this might change in the future

    logging.basicConfig(level=logging.INFO)

    mongo_uri = "mongodb+srv://jscanzoni:Goe3CkqFgFcnqJFR@outfitoracle.6xgii.mongodb.net"
    query = {"search_Id": search_Id}
    client = pymongo.MongoClient(mongo_uri)
    db = client['GucciGang']
    collection = db["OutfitOracle"]

    # check collection for search_Id
    # if exists, return the search_Id

    query = {"search_Id": search_Id}

    # check if search_Id exists in collection
    search_result = collection.find_one(query)

    photoContent = "Woman in brown shirt and black pants"

    if search_result:
        return {"status": "complete", "search_Id": search_Id, "message": "All done! I can't wait to show you what I picked out for you!"}
    else:
        collection = db["customerProfiles"]

        # check if user exists in collection

        userProfile = json.dumps(userProfile)

        prompt = f"""
        You are the Outfit Oracle, an owl who happens to be a fashion expert who helps people find the perfect outfit for any occasion. \n
        You're currently hard at work and want to keep your client entertained. \n
        You can say things like "Hmmm.. should we pick <article>?", or "I'm still looking for the perfect <article> for you!". \n
        "But don't give away the whole outfit! You want to keep them guessing. \n
        """
        if number == 1:
            prompt += f"""This is your first message to this client.. set a strong impression and let them know you understand their request. \n
            You must let them know that you're searching "MonghootDB" (a play on MongoDB) """
        elif number == 3:
            prompt += f"""This is message {number} to the client! Work in something like "we Gucci" or "it's all Gucci" where Gucci is in place of good or cool \n"""
        elif number >= 6:
            prompt += f"""This is message {number} to the client! you must let them know you're almost done and it will be just a bit longer. \n"""
        else:
            prompt += f"""You've already sent {number} messages to this client, so no need to re-introduce yourself. \n"""

        prompt += f""" This is your chance to show off your fashion expertise. \n
        Remember to be an owl, and be charasmatic. \n
        Feel free to use insert a joke if you'd like. \n
        You can use new lines to separate your message, but don't go beyond 6 lines, and keep the message under 140 characters. And no more than a 2 sentences. 
        This person asked: ```{userPrompt}```\n
        They uploaded a photo too with the following contents: ```{photoContent}```\n
        Here's the person's ```{userProfile}```\n
        """

        try:
            # Send a completion call to generate an answer
            response = openai.Completion.create(
                engine="outfit-oracle-gpt-turbo-instruct",
                prompt=prompt,
                max_tokens=700,
            )

            response_text = response['choices'][0]['text'].strip()
        except:
            response_text = "Don't worry my friend, owl keep working on this!"

        return {"status": "incomplete", "search_Id": False, "message": response_text}


'''
print(search_status(
    userPrompt="I'm Alex, a 35-year-old fashion-forward entrepreneur. I have a big pitch meeting with potential investors and want to make a statement with my style. I love bold colors and unique patterns. Can you suggest an outfit that's professional yet shows off my creative side?",
    search_Id="2",
    number=1))
'''
