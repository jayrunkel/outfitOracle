import os
import openai
import json
import pprint
import pymongo
import logging
import uuid
from prompt_img import generate_dalle
import search_db
from save_img import save_img
import re
import threading


openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
# your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_base = "https://outfitoracle.openai.azure.com/"
openai.api_type = 'azure'
openai.api_version = "2023-09-15-preview"  # this might change in the future

logging.basicConfig(level=logging.INFO)

retry = True


def prompt(data):
    searchId = uuid.uuid4()
    logging.info(data.get_json())
    # search_db.search_db()

    user_prompt = data.get_json()['prompt']
    logging.info(user_prompt)

    customerId = "65ab11d6f647fac4814d40df"

    mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=majority"
    db = "GucciGang"
    collection = "customerProfiles"

    connection = pymongo.MongoClient(mongo_uri)

    customer_data = connection[db][collection].find_one({"customerId": customerId}, projection={
        "_id": 0, "images": 0, "imageBase64": 0})

    print(customer_data)
    image = save_img(data.get_json()['image'], str(searchId))

    # product_collection = connection[db][collection]

    # search the customerID (let's hardcode this value maybe for POC?)
    # consider the document model for the customerID - and pull attributes that could be useful for the user prompt.

    customerprofile = json.dumps({"customerData": customer_data})

    # This will correspond to the custom name you chose for your deployment when you deployed a model.
    deployment_name = 'outfit-oracle-gpt-turbo-instruct'

    # Send a completion call to generate an answer

    logging.info('Sending a test completion job')

    json_data = '''```json
      //This is an example template for the JSON object that we need to pass through MongoDB that you should return and are not default values.
      //Order the outfit_articles from head to toe. THIS IS IMPORTANT! Ensure customerprofile is included in the attribute_extract object.
      // DO NOT INCLUE any COMMENT BLOCKS THAT BREAKS JSON!!!. ENSURE IT IS VALID JSON. 
      // ... means that you can add more details
    {
      "customerprofile": { ... },
      "outfits": [
          {
              "outfit_articles": ["dark blue jeans", "black shoes", "black shirt", "black tie", "black suit", "black sunglasses", "black leather gloves", "silver watch"],
              "outfit_name": "Catchy name for the outfit",
              "gpt_response": " You're a fasion advisor and don't reference customerprofile explicitly . Provide Text description / justification of this outfit and how it fits the prompt in twitter size ( up to 280 characters) - Exclude hashtags. ",
              "dalle_prompt": "You are a director for a fashion magazine that will ask DALLE-2 to create an image that complies with OpenAI's safety system (aka, keep it PG) with <insert outfit articles here>. It should be photorealistic, and ensure that the articles of clothing is displayed from head to toe. Ensure that it's using the customerprofile information to fill in the gaps of the person. specify based on the attribute_extract and prompt but prioritize the customerprofile information. it's paramount to describe head to toe of the complete outfit. Be sure to include "Present a complete outfit from head to toe on a model""
          },
          //outfit 2, 3, etc
      ]
    }```
    '''

    # gpt_instructions = "Give me a JSON form of an array of clothing based on the following prompt: "
    gpt_instructions = "THE RESPONSE MUST BE IN STRICT VALID JSON. scape any double quotes. Refer customerprofile as " + customerprofile+" .I  am passing this to an API, so your response must be in valid JSON format. Using the user prompt below, create 3 outfits and embed them into a master array. If the user has a customerprofile object:, overwrite the attributes from the customerprofile object in the attribute_extract object.Ensure that the json_data is valid JSON.Minify the JSON object before submitting it as a response. The final output must be formatted in VALID JSON (values are just examples) as follows: \n'''" + \
        json_data + "'''\n The comments are only there for your instruction and should be left out of the response. Any attributes that are applicable to all articles should be included in the attribute_extract object but also prioritize any data from customerprofile. Add some variance and be sure that no outfit should share more than 3 of the same articles. REMEMBER: THE RESPONSE MUST BE IN STRICT VALID JSON."

    complete_prompt = gpt_instructions + " User prompt:" + user_prompt + \
        " The user also uploaded an image of: " + json.dumps(image["caption"])

    try:
        # Send a completion call to generate an answer
        response = openai.Completion.create(
            engine=deployment_name,
            prompt=complete_prompt,
            max_tokens=4000
        )

        # Extract and print text response
        response_text = response['choices'][0]['text'].strip()

        # increment character by character until you find the first {, then strip everything before that
        response_text = response_text[response_text.find("{"):]
        # remove all // comments
        response_text = re.sub(r"//.*", "", response_text)

        logging.info("Raw Response Text:")
        logging.info(response_text)

        # Parse the response as JSON
        try:
            json_data = json.loads(response_text)
        except:
            logging.warning("Failed to decode the response as JSON.")
           # send the response text to OPENAI with a prompt to fix the JSON
            # Send a completion call to generate an answer
            response = openai.Completion.create(
                engine=deployment_name,
                prompt="Fix the JSON response from the previous prompt to be STRICT VALID JSON and escape any double quotes... if there are any characters before the first {, strip them: ```" +
                response_text + "```",
                max_tokens=4000
            )

            response_text = response['choices'][0]['text'].strip()

            logging.info("Raw Response Text:")
            logging.info(response_text)
            pass

        json_data = json.loads(response_text)

        # Pretty print the JSON data as if it would be shown for mongodb
        logging.info("JSON Response:")
        logging.info(json_data)

        logging.info(searchId)

        payload = json_data
        payload["searchId"] = str(searchId)
        payload["customerProfile"] = customer_data
        # for each each payload.outfits, generate a dalle image and add it to the payload do these in parallel

        '''
        def generate_and_save_dalle(outfit, lock):
            dalle_image = generate_dalle(outfit["dalle_prompt"])
            outfit["dalle_image"] = dalle_image

            with lock:  # Use lock to ensure thread safety
                for i, item in enumerate(payload["outfits"]):
                    if item["dalle_prompt"] == outfit["dalle_prompt"]:
                        payload["outfits"][i] = outfit
                        break

        threads = []
        lock = threading.Lock()  # Create a lock object

        for outfit in payload["outfits"]:
            thread = threading.Thread(
                target=generate_and_save_dalle, args=(outfit, lock))
            threads.append(thread)
            thread.start()

        for thread in threads:
            thread.join()  # Ensure all threads have completed
        '''

        logging.info("Start DALL-E image generation.")

        for outfit in payload["outfits"]:
            logging.info("Generating DALL-E image for outfit: " +
                         outfit["dalle_prompt"])
            dalle_image = generate_dalle(outfit["dalle_prompt"])
            outfit["dalle_image"] = dalle_image

        logging.info("All DALL-E images have been generated.")

        search_db.search_db(payload)
        return {"searchID": str(searchId)}

    except json.JSONDecodeError as e:
        logging.warning("Failed to decode the response as JSON.")
        logging.warning("Error message:", e.msg)
        logging.warning("Error at line:", e.lineno, "column:", e.colno)
        # Adjust the range as needed
        logging.warning("Error context:", e.doc[e.pos-20:e.pos+20])
    except Exception as e:
        logging.warning("An error occurred:", str(e))
