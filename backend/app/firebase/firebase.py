#firebase.py
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("app/firebase/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()
