from sentence_transformers import SentenceTransformer, util
from PIL import Image
import os
from bson import json_util


def vectorize(input):

    preTrainedModelName = "clip-ViT-L-14"

    # Load CLIP model
    model = SentenceTransformer(preTrainedModelName)

    # Check if input is a file-like object
    if hasattr(input, 'read'):
        # Input is a file-like object
        encoded = model.encode(Image.open(input)).tolist()
    elif os.path.isfile(input):
        # Input is a file path
        encoded = model.encode(Image.open(input)).tolist()
    else:
        # Handle other cases, possibly raise an error
        raise ValueError("Input must be a file xpath or a file-like object")

    json_result = json_util.dumps(
        {'docs': encoded}, json_options=json_util.RELAXED_JSON_OPTIONS)

    return (encoded)
