import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    if os.getenv("FIREBASE_CREDENTIALS"):
        firebase_creds = json.loads(os.environ["FIREBASE_CREDENTIALS"])
        cred = credentials.Certificate(firebase_creds)
    else:
        cred = credentials.Certificate("serviceKey.json")

    firebase_admin.initialize_app(cred)

db = firestore.client()