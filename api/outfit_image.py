import requests
import pymongo
import pprint
import json
import openai
from openai import AzureOpenAI
import os
# import search_db
import uuid
import logging
import base64
import io
from bson import binary
from PIL import Image


logging.basicConfig(level=logging.DEBUG)


'''def outfit_image():

    openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
    openai.api_type = "azure"
    openai.base_url = "https://outfitoracle.openai.azure.com/"
    openai.api_version = "2023-06-01-preview"


    userprompt = "Modify this image with a black midi dress, grey wool coat, black patent pumps, silver cuff bracelet, black aviator sunglasses, and black leather gloves."

    image_file = "./ManStyle1.png"
    img = Image.open(image_file)
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    compressed_image_io = io.BytesIO()
    img.save(compressed_image_io, format='JPEG', quality=85)
    compressed_image_io.seek(0)
    image_binary = binary.Binary(compressed_image_io.getvalue())

    response = AzureOpenAI.images.create(
        # model="dall-e-2",
        image=image_binary,
        # mask=open("mask.png", "rb"),
        prompt=userprompt,
        n=1,
        size="1024x1024"
    )

    ' ''response = openai.Image.create_variation(
        # engine="davinci",
        prompt=userprompt,
        image=image_binary,
        size="1024x1024",
        # labels=["outfit"],
    )

    response2 = openai.Image.create_edit(
        # engine="davinci",
        prompt=userprompt,
        image=image_binary,
        size="1024x1024"
        # labels=["outfit"],
    )' ''

    '' '(
        prompt=userprompt,
        n=1,
        size="1024x1024",
        image=encoded_image
    )'' '

    image_url = response["data"][0]["url"]
    # image_url = response2["data"][0]["url"]
    pprint.pprint(response)
    # pprint.pprint(response2)
    # print(userprompt + profile + additionalPrompting + "\n")
    print(userprompt + "\n")
    print(image_url)
'''


def generate_image():

    client = AzureOpenAI(api_key="45eefc80e0914e64995ed91c3c7cf175",
                         api_version="2023-06-01-preview",
                         azure_endpoint="https://outfitoracle.openai.azure.com"
                         )

    # Create an image by using the image generation API
    generation_response = client.images.generate(
        model='dall-e-2',
        prompt='A painting of a dog',    # Enter your prompt text here
        size='1024x1024',
        n=2
    )

    # Retrieve the generated image
    # extract image URL from response
    image_url = generation_response["data"][0]["url"]
    '''generated_image = requests.get(image_url).content  # download the image
    with open(image_path, "wb") as image_file:
        image_file.write(generated_image)

    # Display the image in the default image viewer
    image = Image.open(image_path)
    image.show()'''
    return requests.get(image_url)


generate_image()
