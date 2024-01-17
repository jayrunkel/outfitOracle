import os
import openai
import pprint
openai.api_key = "45eefc80e0914e64995ed91c3c7cf175"
openai.api_base = "https://outfitoracle.openai.azure.com/" # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_type = 'azure'
openai.api_version = "2023-09-15-preview" # this might change in the future


# Generate image for the outfit based on "dalle_prompt"
# userprompt = "Modify this image with black slim fit blazer, black turtleneck, dark grey dress pants, black leather derby shoes, black leather band watch, and sleek black sunglasses."

# userprompt ="Create this image with a grey tweed blazer, a black turtleneck sweater, and dark blue jeans. Add grey loafers, a silver watch, sleek black sunglasses, and black leather gloves for a complete look. The individual should exhibit a blend of casual and festive fashion, fitting for a 'spy agents' themed company year-end party. Age: 58 Heritage: German Gender: Male Skin Tone: Light tan Favorite Color: Black and grey. Outfit: The clothing should include a top, pants, and shoes, all reflecting a balance between casual style and party attire. The entire outfit should be visible in the image, providing a clear view from head to toe. The overall look should capture the essence of a spy, tailored to the individual's preferences."

# dalle_prompt = "Create an image featuring a person of non-binary gender wearing an outfit consisting of a red graphic t-shirt, black skinny jeans, white leather high tops, a black leather backpack, a silver chain bracelet, a black beanie, black round sunglasses, and silver stud earrings. Show the full body from head to toe."


def generate_dalle(dalle_prompt):
    response = openai.Image.create(
        prompt= dalle_prompt,
        size='1024x1024',
        n=1
    
    )
    return response["data"][0]["url"]




