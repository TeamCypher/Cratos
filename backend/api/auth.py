import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests

from backend.data.repositories import UserRepository

# Setup HTTP Bearer scheme
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency to verify Google JWT token and return the user.
    Creates the user in the database if they don't exist.
    """
    token = credentials.credentials
    client_id = os.getenv("GOOGLE_CLIENT_ID")

    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_ID environment variable is not set. Please set it in your .env file."
        )

    try:
        # Verify the token with Google
        id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)
        
        # Extract user info
        user_id = id_info.get("sub")
        email = id_info.get("email")
        name = id_info.get("name", "Unknown User")
        
        if not user_id or not email:
            raise ValueError("Token missing user ID or email.")
            
        user_repo = UserRepository()
        user = user_repo.get_user(user_id)
        
        # Create user if it doesn't exist
        if not user:
            user_repo.create_user(user_id=user_id, name=name, email=email)
            user = user_repo.get_user(user_id)
            
        return user
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )
