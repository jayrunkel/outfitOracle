import os
import openai
import json
import pprint
import pymongo
import logging
import uuid

openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
openai.api_base = "https://outfitoracle.openai.azure.com/" # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_type = 'azure'
openai.api_version = "2023-09-15-preview" # this might change in the future

logging.basicConfig(level=logging.INFO)


def prompt(data):
  searchId = uuid.uuid4()
  logging.info(data.get_json())
  # search_db.search_db()

  user_prompt = data.get_json()['prompt']
  logging.info(user_prompt)

  # mongo_uri = "mongodb+srv://GucciGang:GucciGang@guccigang.jxnbg.mongodb.net/?retryWrites=true&w=majority"
  # db = "GucciGang"
  # collection = "customerProfiles"

  # connection = pymongo.MongoClient(mongo_uri)
  # product_collection = connection[db][collection]

  #search the customerID (let's hardcode this value maybe for POC?)
  # consider the document model for the customerID - and pull attributes that could be useful for the user prompt.
  # example: 
  customerprofile ='''
  {
    "_id": {
      "$oid": "65a6c352363965e8f99bf81c"
    },
    "customerId": "65a6f67fe84137eef3262f2d",
    "first": "Jay",
    "last": "Runkel",
    "gender": "male",
    "skinTone": "blue",
    "heritage": "german",
    "favColor": "blue",
    "preferredStyle": "sharp",
    "age": "58",
    "pictureFile": "ManStyle1.jpg",
    "pantSize": "large",
    "shirtSize": "small",
    "email": "jay.runkel@mongodb.com"
  }
  '''

  deployment_name='outfit-oracle-gpt-turbo-instruct' #This will correspond to the custom name you chose for your deployment when you deployed a model. 

  # Send a completion call to generate an answer


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
  gpt_instructions = "I am passing this to an API, so your response must be in valid JSON format. Using the user prompt below, create 3 outfits and embed them into a master array. If the user has a customerprofile object:" + customerprofile + ", include the attributes from the customerprofile object in the attribute_extract object.Ensure that the json_data is valid JSON.Minify the JSON object before submitting it as a response. The final output must be formatted in VALID JSON as follows: \n'''" + \
      json_data + "'''\n The comments are only there for your instruction and should be left out of the response. Any attributes that are applicable to all articles should be included in the attribute_extract object. Add some variance and be sure that no outfit should share more than 3 of the same articles."

  gpt_instructions1 = "Based on the user prompt, create 3 array of outfits (valid JSON Objects) that follow the formatting:"+ json_data + " Any attributes that are applicable to all outfits should be included in the attribute_extract object. If the user has a customerprofile object:" + customerprofile + ", include the attributes from the customerprofile object in the attribute_extract object.Ensure that the json_data is valid JSON.Minify the JSON object before submitting it as a response."

  user_prompt1 = "I'm a casually stylish male with a light tan skin tone, looking for an outfit for a 'spy agents' themed company year-end party. My sizes are medium shirts, 32 waist pants, and my budget is up to $200. I prefer minimalist watches and sleek sunglasses for accessories, and comfortable loafers for footwear. The party is indoor, semi-formal, in cool weather. I like incorporating classic black and grey colors for the theme, and my shoe size is 10."

  user_prompt2 = "I'm a casually fashionable female with a fair skin tone, seeking an ensemble for a 'spy agents' themed corporate end-of-year celebration. My clothing sizes vary: small tops, size 28 pants, with a budget of up to $250. I have a penchant for elegant bracelets and chic eyewear as accessories, paired with snug ankle boots for shoes. The event is an indoor, semi-formal affair in a cooler climate. I'm fond of blending traditional black and grey hues to suit the theme, and my shoe size is 8."


  user_prompt3 = "I'm a woman planning to attend an upcoming EDM concert and I'm looking for some fashion advice. I want an outfit that's stylish, comfortable for dancing, and suitable for the energetic and vibrant atmosphere of an EDM event. I'm open to bold colors and unique designs that stand out in a crowd. Additionally, I'd appreciate suggestions for practical yet fashionable footwear, as I'll be on my feet most of the time. Any tips on accessories that complement the outfit and enhance the overall concert experience would also be welcome. My budget is $2000 and I'm a size 8."

  user_prompt4 = "I want an outfit that's stylish, comfortable for dancing, and suitable for the energetic and vibrant atmosphere of an EDM event. I'm open to bold colors and unique designs that stand out in a crowd. Additionally, I'd appreciate suggestions for practical yet fashionable footwear, as I'll be on my feet most of the time. Any tips on accessories that complement the outfit and enhance the overall concert experience would also be welcome. My budget is $2000 and I'm a size 8." + customerprofile

  complete_prompt = gpt_instructions + " User prompt:" + user_prompt

  try:
      # Send a completion call to generate an answer
      response = openai.Completion.create(
          engine=deployment_name, 
          prompt=complete_prompt, 
          max_tokens=4000
      )

      # Extract and print text response
      response_text = response['choices'][0]['text'].strip()
      logging.info("Raw Response Text:")
      logging.info(response_text)

      # Parse the response as JSON
      json_data = json.loads(response_text)

      # Pretty print the JSON data as if it would be shown for mongodb
      logging.info("JSON Response:")
      logging.info(json_data)

      logging.info(searchId)
      return {"searchId": searchId} 

  except json.JSONDecodeError as e:
      logging.warning("Failed to decode the response as JSON.")
      logging.warning("Error message:", e.msg)
      logging.warning("Error at line:", e.lineno, "column:", e.colno)
      logging.warning("Error context:", e.doc[e.pos-20:e.pos+20])  # Adjust the range as needed
  except Exception as e:
      logging.warning("An error occurred:", str(e))