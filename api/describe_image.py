import os
import openai
import json
import pprint
import pymongo
import logging
import requests
import uuid

logging.basicConfig(level=logging.INFO)


# send a base64 image to ms vision api to get dense captions to images
def get_dense_captions(image):
    import requests
    import json

    subscription_key = "74071a213031461bb6c0cae86ae6c4e1"

    url = "https://sawestvisionsandbox.cognitiveservices.azure.com/computervision/imageanalysis:analyze"
    params = {
        "api-version": "2023-10-01",
        "model-version": "latest",
        "language": "en",
        "features": "denseCaptions"
    }
    headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscription_key  # Replace with your actual key
    }
    data = {
        "url": "https://www.instyle.com/thmb/gVqVKBCTh3H5-Gr6T4Akye25XwU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/springdatenightoutfits-lead-86de049c32f141df86659b8cada81cad.jpg"
    }

    response = requests.post(url, params=params, headers=headers, json=data)
    print(response.json())


get_dense_captions("111")
