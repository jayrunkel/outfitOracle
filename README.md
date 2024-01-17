# Outfit Oracle

## Whitelist Your IP in Azure
[Add it here](https://portal.azure.com/#@mongodb0.onmicrosoft.com/resource/subscriptions/ddff37eb-831c-4e1b-ae37-19af67c300e7/resourceGroups/gucci-gang-hackathon-24/providers/Microsoft.CognitiveServices/accounts/outfitoracle/accessControl)

## Start API
In Terminal:
```
cd ./api
pip3 install -r requirements.txt
export FLASK_APP=main.py
flask run
```

endpoint URL: http://127.0.0.1:5000

## API Endpoints

| Endpoint     | Description                                                                  | Method          | Body                              | Response                          |
| ------------ | ---------------------------------------------------------------------------- | --------------- | --------------------------------- | --------------------------------- |
| /            | Hello World                                                                  | GET             |                                   | Hello, World!                     |
| /upload      | Upload Binary Image to MongoDB and asynchronously Vectorize                  | POST: Multipart | file: <upload file>               | {<br>'_id'  <br>'image_name'<br>} |
| /image/<_id> | image_binary that's able to be embedded into html using <img> tags           | GET             |                                   | <image binary>                    |
| /prompt      | Send a prompt to GPT, receive a searchId back to look up outfit suggestions. | POST: JSON      | {<br>prompt: ""<br>image: ""<br>} | {<br>'searchId'<br>}              |