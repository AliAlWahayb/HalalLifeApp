from typing import Dict, Any, List, Optional
from datetime import datetime

from app.db.firebase import FirestoreDB, create_firebase_user, get_firebase_user
from app.schemas.user import UserCreate, UserUpdate


class FirebaseUserCRUD:
    """Firebase User CRUD operations"""

    def __init__(self):
        self.db = FirestoreDB("users")

    async def create(self, user_in: UserCreate) -> Dict[str, Any]:
        """Create a new user in Firebase Auth and Firestore"""
        # Create user in Firebase Auth
        auth_user = create_firebase_user(
            email=user_in.email,
            password=user_in.password,
            display_name=user_in.username
        )

        # Prepare user data for Firestore (exclude password)
        user_data = {
            "email": user_in.email,
            "username": user_in.username,
            "is_active": True,
            "is_superuser": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

        # Store in Firestore with Auth UID as document ID
        await self.db.set_with_id(auth_user["uid"], user_data)

        # Return complete user data
        return {
            **user_data,
            "id": auth_user["uid"]
        }

    async def get(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user by ID"""
        return await self.db.get_by_id(user_id)

    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email"""
        results = await self.db.query("email", "==", email)
        return results[0] if results else None

    async def get_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get a user by username"""
        results = await self.db.query("username", "==", username)
        return results[0] if results else None

    async def get_multi(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get multiple users"""
        all_users = await self.db.get_all()
        return all_users[skip:skip+limit]

    async def update(self, user_id: str, user_in: UserUpdate) -> Dict[str, Any]:
        """Update a user"""
        # Get current user
        user = await self.get(user_id)
        if not user:
            raise ValueError("User not found")

        # Prepare update data
        update_data = {}
        if user_in.email is not None:
            update_data["email"] = user_in.email
        if user_in.username is not None:
            update_data["username"] = user_in.username
        if user_in.is_active is not None:
            update_data["is_active"] = user_in.is_active

        # Only update if there's data to update
        if update_data:
            update_data["updated_at"] = datetime.utcnow().isoformat()
            await self.db.update(user_id, update_data)

        # Get updated user
        updated_user = await self.get(user_id)
        return updated_user

    async def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user (handled by Firebase Auth in the frontend)"""
        # This is a placeholder - auth in a Firebase-based app is typically
        # handled directly between the client and Firebase Auth
        # This method would be used for server-to-server authentication scenarios
        return await self.get_by_email(email)

    def is_active(self, user: Dict[str, Any]) -> bool:
        """Check if a user is active"""
        return user.get("is_active", False)

    def is_superuser(self, user: Dict[str, Any]) -> bool:
        """Check if a user is a superuser"""
        return user.get("is_superuser", False)


# Create instance to use in API
firebase_user_crud = FirebaseUserCRUD()
