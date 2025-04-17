import os
import json
from typing import Optional, Dict, Any, List
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings

# Global variables to store Firebase app and db instances
firebase_app = None
firebase_db = None


def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global firebase_app, firebase_db

    # Check if already initialized
    if firebase_app:
        return firebase_db

    try:
        # If credentials provided as JSON string in environment variable
        if settings.FIREBASE_CREDENTIALS:
            cred_dict = json.loads(settings.FIREBASE_CREDENTIALS)
            cred = credentials.Certificate(cred_dict)
        # If credentials provided as a file path
        elif settings.FIREBASE_CREDENTIALS_PATH:
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        else:
            raise ValueError("Firebase credentials not provided")

        # Initialize the app
        firebase_app = firebase_admin.initialize_app(cred)
        firebase_db = firestore.client()
        return firebase_db
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}")
        raise


def get_firebase_db():
    """Get Firestore database instance"""
    global firebase_db
    if not firebase_db:
        initialize_firebase()
    return firebase_db

# User management functions with Firebase Auth


def create_firebase_user(email: str, password: str, display_name: Optional[str] = None) -> Dict[str, Any]:
    """Create a new user in Firebase Auth"""
    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name
        }
    except Exception as e:
        print(f"Error creating Firebase Auth user: {str(e)}")
        raise


def get_firebase_user(uid: str) -> Dict[str, Any]:
    """Get user details from Firebase Auth"""
    try:
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name
        }
    except Exception as e:
        print(f"Error getting Firebase Auth user: {str(e)}")
        raise

# Firestore CRUD operations


class FirestoreDB:
    """Generic Firestore CRUD operations"""

    def __init__(self, collection_name: str):
        self.db = get_firebase_db()
        self.collection = self.db.collection(collection_name)

    async def get_all(self) -> List[Dict[str, Any]]:
        """Get all documents in the collection"""
        docs = self.collection.stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    async def get_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get a document by ID"""
        doc = self.collection.document(doc_id).get()
        if doc.exists:
            return {**doc.to_dict(), "id": doc.id}
        return None

    async def query(self, field: str, operator: str, value: Any) -> List[Dict[str, Any]]:
        """Query documents by a field"""
        docs = self.collection.where(field, operator, value).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]

    async def add(self, data: Dict[str, Any]) -> str:
        """Add a new document to the collection"""
        doc_ref = self.collection.document()
        doc_ref.set(data)
        return doc_ref.id

    async def set_with_id(self, doc_id: str, data: Dict[str, Any]) -> None:
        """Set a document with a specific ID"""
        self.collection.document(doc_id).set(data)

    async def update(self, doc_id: str, data: Dict[str, Any]) -> None:
        """Update a document"""
        self.collection.document(doc_id).update(data)

    async def delete(self, doc_id: str) -> None:
        """Delete a document"""
        self.collection.document(doc_id).delete()
