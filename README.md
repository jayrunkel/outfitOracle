# Outfit Oracle
# Details

**Project** : _insert project title here_  
**Team Number** : _insert team number here_  
**Team Name** : _insert team name here_  
**Demonstration Video** : _Insert link to demonstration video_  

# Overview

_Insert Executive Overview of your application/demonstration_

# Justification

_Please explain why you decided to build the application/demonstration for this project. What inspired you? What problems does it solve or how will it make Presales activities easier?_
_What MongoDB competitive differentiators (developer productivity, resiliency, scalability, etc.) does this demonstration showcase?_

# Detailed Application Overview

_Describe the architecture of your application and include a diagram._
_List all the MongoDB components/products used in your demonstration._
_Describe what you application does and how it works_


# Roles and Responsibilities

_List all the team members and summarize the contributions each member made to this project_

# Demonstration Script

_Demonstration script (or link to script) goes here_

_The demonstration script should provide all the information required for another MongoDB SA to deliver your demonstration to a prospect. This should include:_

* _setup/installation steps_
* _step by step instructions on how to give the demonstration_
* _key points to emphasize at each point in the demonstration_
* _any tear down steps required to reset the demonstration so it is ready for the next time_
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
