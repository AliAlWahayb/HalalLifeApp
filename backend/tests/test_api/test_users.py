import pytest
from fastapi.testclient import TestClient
from app.core.security import get_password_hash
from app.models.user import User


def test_create_user(client, db_session):
    # Create superuser for auth
    admin_user = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("password"),
        is_active=True,
        is_superuser=True
    )
    db_session.add(admin_user)
    db_session.commit()

    # Login as admin
    login_response = client.post(
        "/api/auth/login",
        data={"username": "admin@example.com", "password": "password"}
    )
    token = login_response.json()["access_token"]

    # Test creating a new user
    response = client.post(
        "/api/users/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data

    # Verify user exists in db
    user = db_session.query(User).filter(
        User.email == "test@example.com").first()
    assert user is not None
    assert user.username == "testuser"


def test_get_user_me(client, db_session):
    # Create test user
    test_user = User(
        email="testme@example.com",
        username="testme",
        hashed_password=get_password_hash("password"),
        is_active=True
    )
    db_session.add(test_user)
    db_session.commit()

    # Login
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testme@example.com", "password": "password"}
    )
    token = login_response.json()["access_token"]

    # Get user profile
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "testme@example.com"
    assert data["username"] == "testme"
