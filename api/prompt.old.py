import logging
import uuid
import os
import pymongo
import pprint
import json
import openai
from openai import AzureOpenAI
# import search_db

logging.basicConfig(level=logging.INFO)


def prompt(data):
    searchId = uuid.uuid4()

    # search_db.search_db()

    object = {"searchId": searchId}

#    return jsonify(object)

    # TODO: The 'openai.api_base' option isn't read in the client API. You will need to pass it when you instantiate the client, e.g. 'OpenAI(api_base="https://outfitoracle.openai.azure.com/")'
    # openai.api_base = "https://outfitoracle.openai.azure.com/"
    # this might change in the future

    deployment_name = 'outfit-oracle-gpt-turbo-instruct'

    # Send a completion call to generate an answer

    '''
    1. Take user profile's BSON object and convert it into a JSON object
    2. Pass the JSON object into the GPT prompt.
    3. Include the user_prompt into consideration with the user profile, generate searchID
    4. Take the response from GPT and convert it into a BSON object (for semmantic search -SAM)

    use case:
    - watch is more focused (budget is 200 for a watch)
    - output: turn the extract into the array- and this could be on each article type. If article type is not specified, then it's a general atrriburte for all article types.
    example:

    "attribute_extract": [ {"articleType": "Watches", "budget": 200}, {"articleType": "Shoes", "budget": 100} , {"gender": "Women"}]

    Prompt extract: anything that's applicable to the user profile.
        -> See outfitOracle for more details

        TODO: Give gpt_instructions this set of instructions and format for the output
    '''

    logging.info('Sending a test completion job')

    json_data = '''
    [
        {
            "outfit_articles": ["dark blue jeans", "black shoes", "black shirt", "black tie", "black suit", "black sunglasses", "black leather gloves", "silver watch"],
            "attribute_extract": {
                "gender": "Women",
                "masterCategory": "Accessories",
                "subCategory": "Watches",
                "articleType": "Watches",
                "baseColour": "Black",
                "season": "Winter",
                "usage": "Casual",
                "price": 63.77,
                "averageRating": 4.73
            },
            "gpt_response": "Text description / justification of this outfit and how it fits the prompt",
            "dalle_prompt": "Modify this image with <insert outfit articles here>"
        },
        ...
    ]

    '''

    # gpt_instructions = "Give me a JSON form of an array of clothing based on the following prompt: "
    gpt_instructions = "I am passing this to an API, so your response must be in valid JSON format. Using the user prompt below, create 3 outfits and embed them into a master array. The final output must be formatted in VALID JSON as follows: \n'''" + \
        json_data + "'''\n The comments are only there for your instruction and should be left out of the response. Any attributes that are applicable to all articles should be included in the attribute_extract object. Add some variance and be sure that no outfit should share more than 3 of the same articles."

    user_prompt1 = "I'm a casually stylish male with a light tan skin tone, looking for an outfit for a 'spy agents' themed company year-end party. My sizes are medium shirts, 32 waist pants, and my budget is up to $200. I prefer minimalist watches and sleek sunglasses for accessories, and comfortable loafers for footwear. The party is indoor, semi-formal, in cool weather. I like incorporating classic black and grey colors for the theme, and my shoe size is 10."

    user_prompt2 = "I'm a casually fashionable female with a fair skin tone, seeking an ensemble for a 'spy agents' themed corporate end-of-year celebration. My clothing sizes vary: small tops, size 28 pants, with a budget of up to $250. I have a penchant for elegant bracelets and chic eyewear as accessories, paired with snug ankle boots for shoes. The event is an indoor, semi-formal affair in a cooler climate. I'm fond of blending traditional black and grey hues to suit the theme, and my shoe size is 8."

    user_prompt3 = "I'm a woman planning to attend an upcoming EDM concert and I'm looking for some fashion advice. I want an outfit that's stylish, comfortable for dancing, and suitable for the energetic and vibrant atmosphere of an EDM event. I'm open to bold colors and unique designs that stand out in a crowd. Additionally, I'd appreciate suggestions for practical yet fashionable footwear, as I'll be on my feet most of the time. Any tips on accessories that complement the outfit and enhance the overall concert experience would also be welcome. My budget is $2000 and I'm a size 8."

    complete_prompt = gpt_instructions + " User prompt:" + user_prompt2

    logging.info(complete_prompt)

    try:
        client = AzureOpenAI(api_key="45eefc80e0914e64995ed91c3c7cf175",
                             api_version="2023-09-15-preview",
                             azure_endpoint="https://outfitoracle.openai.azure.com/"
                             )
        # Send a completion call to generate an answer
        response = client.completions.create(model=deployment_name,
                                             prompt=complete_prompt,
                                             max_tokens=4000)

        # Extract and print text response
        response_text = response.choices[0].text.strip()
        logging.info("Raw Response Text:")
        logging.info(response_text)

        # Parse the response as JSON
        json_data = json.loads(response_text)

        # Pretty print the JSON data
        logging.info(json_data)
        pprint.pprint(json_data)

        # Feed this into MongoDB collection

    except json.JSONDecodeError as e:
        logging.warning("Failed to decode the response as JSON.")
        logging.warning("Error message:", e.msg)
        logging.warning("Error at line:", e.lineno, "column:", e.colno)
        # Adjust the range as needed
        logging.warning("Error context:", e.doc[e.pos-20:e.pos+20])
    except Exception as e:
        logging.warning("An error occurred:", str(e))


prompt("test")
