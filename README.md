# Outfit Oracle
# Details

**Project** : Outfit Oracle 
**Team Number** : 2 
**Team Name** : Gucci Gang  
**Demonstration Video** : _Insert link to demonstration video_  

# Overview

The Outfit Oracle, an AI-driven fashion stylist, transforms the shopping journey by seamlessly integrating AI-driven outfit suggestions and precise product matching. Users can effortlessly upload photos, articulate their preferences, and enjoy personalized outfit recommendations. The AI engine goes beyond suggestions, providing insightful summaries on why each outfit perfectly aligns with the occasion, offering a truly curated and sophisticated shopping experience.

# Justification

We decided to build this application to address the challenges users face in curating personalized outfits and simplifying the shopping process. The inspiration came from the desire to leverage AI technologies to enhance the fashion discovery journey. 
The concept behind 'The Outfit Oracle' can be extended to revolutionize various e-commerce domains and product categories where MongoDB hosts the product catalog. This app will help the Presales team to highlight the seamless integration of genAI and MongoDB, making demos more engaging and impactful.

***MongoDB Competitive Differentiators:***

* Developer Productivity
    * Flexible Document Model
    * Aggregation Framework
* Lower TCO
    * Atlas Search 
    * Built-in Vector Search
* Faster Time to Market
    * Real-time Analytics

# Detailed Application Overview

### Architecture Diagram ###
![image](https://github.com/jayrunkel/outfitOracle/assets/45085638/d1bb56c8-b5c0-4c66-8af2-35de244fb90e)

***MongoDB Components/ Products Used:***
Atlas, App Services, Charts, Full-text Search, Vector Search, Aggregation Framework, 

_Describe what you application does and how it works_


# Roles and Responsibilities

* Jay Runkel - **UI/UX Maestro**
* Chris Tselebis **Visualization Wizard**
* Samadnya Kalaskar **Search Enchantress**
* Jason Scanzoni **Flask Sorcerer**
* Peter Do **AI Prompt Alchemist**


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
