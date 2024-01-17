from flask import Flask
from flask import request
from flask import jsonify
import search_db
import uuid


def prompt(data):
    searchId = uuid.uuid4()

    search_db.search_db()

    object = {"searchId": searchId}

    return jsonify(object)
