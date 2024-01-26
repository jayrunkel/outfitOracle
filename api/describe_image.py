import logging

logging.basicConfig(level=logging.INFO)

# add your IP to whitelist https://portal.azure.com/#@mongodb0.onmicrosoft.com/resource/subscriptions/ddff37eb-831c-4e1b-ae37-19af67c300e7/resourceGroups/SA_West_RG/providers/Microsoft.CognitiveServices/accounts/SAWestVisionSandbox/accessControl

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
        "url": "http://gucci.scnz.co/image/"+image
    }

    response = requests.post(url, params=params, headers=headers, json=data)

    print(response.json())
    # concatenate the captions, denseCaptionsResult.values.text
    captions = ""
    for caption in response.json()["denseCaptionsResult"]["values"]:
        if caption["confidence"] >= .7:
            captions += caption["text"] + ". "

    return (captions)
