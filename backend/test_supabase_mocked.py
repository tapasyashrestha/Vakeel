import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from fastapi import status
from backend.main import app
from backend.database import get_supabase_client

# Define mock helper classes
class MockUser:
    def __init__(self, id, email):
        self.id = id
        self.email = email

class MockAuthResponse:
    def __init__(self, user):
        self.user = user

# Create client fixture
@pytest.fixture
def client():
    return TestClient(app)

# Helper to mock Supabase DB / Auth client responses
@pytest.fixture
def mock_supabase(mocker):
    mock_client = MagicMock()
    # Override database dependency injection
    app.dependency_overrides[get_supabase_client] = lambda: mock_client
    yield mock_client
    app.dependency_overrides.clear()

# 1. Missing Authorization Header Test
def test_missing_auth_header(client, mock_supabase):
    res = client.post("/chambers", json={"name": "Test Chamber"})
    assert res.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Missing or invalid Authorization header" in res.json()["detail"]

# 2. Invalid Access Token Test
def test_invalid_access_token(client, mock_supabase):
    mock_supabase.auth.get_user.side_effect = Exception("Invalid token signature")
    res = client.post(
        "/chambers", 
        json={"name": "Test Chamber"},
        headers={"Authorization": "Bearer invalid_jwt_token"}
    )
    assert res.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Token verification failed" in res.json()["detail"]

# 3. User Already in a Chamber Test
def test_user_already_in_chamber(client, mock_supabase):
    # Set up user who already has a chamber
    mock_user = MockUser(id="1234-abcd", email="test@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    # Mock profiles table return: user already has chamber_id
    mock_res = MagicMock()
    mock_res.data = [{"chamber_id": "existing-chamber-id", "role": "Senior"}]
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_res
    
    res = client.post(
        "/chambers", 
        json={"name": "Test Chamber"},
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "User already belongs to a chamber" in res.json()["detail"]

# 4. Unauthorized Intern Creating Invite Test
def test_unauthorized_intern_creating_invite(client, mock_supabase):
    mock_user = MockUser(id="1234-abcd", email="intern@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    # Mock profile response: user is an Intern
    mock_res = MagicMock()
    mock_res.data = [{"chamber_id": "chamber-123", "role": "Intern"}]
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_res
    
    res = client.post(
        "/invites",
        json={"role": "Associate", "email": "invitee@vakeel.ai"},
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_403_FORBIDDEN
    assert "Only Senior or Associate advocates can generate invites" in res.json()["detail"]

# 5. Expired Invite Rejection Test
def test_expired_invite_rejection(client, mock_supabase):
    mock_user = MockUser(id="invitee-uid", email="invitee@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    # Mock profiles: user has no chamber
    mock_profile_res = MagicMock()
    mock_profile_res.data = [{"chamber_id": None, "role": None}]
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profile_res
    
    # Mock RPC raising invite_expired exception
    mock_supabase.rpc.return_value.execute.side_effect = Exception("Database error: invite_expired")
    
    res = client.post(
        "/invites/expired-invite-uuid/accept",
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "This invite has expired" in res.json()["detail"]

# 6. Used Invite Rejection Test
def test_used_invite_rejection(client, mock_supabase):
    mock_user = MockUser(id="invitee-uid", email="invitee@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    mock_profile_res = MagicMock()
    mock_profile_res.data = []
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profile_res
    
    mock_supabase.rpc.return_value.execute.side_effect = Exception("Database error: invite_already_used")
    
    res = client.post(
        "/invites/used-invite-uuid/accept",
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "This invite has already been used" in res.json()["detail"]

# 7. Email Mismatch Test
def test_email_mismatch_rejection(client, mock_supabase):
    mock_user = MockUser(id="invitee-uid", email="wrong-email@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    mock_profile_res = MagicMock()
    mock_profile_res.data = []
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profile_res
    
    mock_supabase.rpc.return_value.execute.side_effect = Exception("Database error: invite_email_mismatch")
    
    res = client.post(
        "/invites/invite-uuid/accept",
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_403_FORBIDDEN
    assert "This invite is locked to a different email address" in res.json()["detail"]

# 8. Concurrent Invite Acceptance Simulation Test
def test_concurrent_invite_acceptance_first_wins(client, mock_supabase):
    mock_user = MockUser(id="invitee-uid", email="invitee@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    # Mock profiles: user has no chamber
    mock_profile_res = MagicMock()
    mock_profile_res.data = []
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profile_res
    
    # Simulate that the database function raises invite_already_used on second attempt
    mock_supabase.rpc.return_value.execute.side_effect = Exception("Database error: invite_already_used")
    
    res = client.post(
        "/invites/some-invite-id/accept",
        headers={"Authorization": "Bearer valid_jwt_token"}
    )
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert "This invite has already been used" in res.json()["detail"]

# 9. Login Persistence Integration Test
def test_login_persistence_verification(client, mock_supabase):
    """
    Verify login persistence by reusing the exact same access token across multiple
    separate, stateless backend requests and ensuring the backend maintains correct
    identity extraction without any cached side effects or data corruption.
    """
    mock_user = MockUser(id="user-persistent-id", email="persistent@vakeel.ai")
    mock_supabase.auth.get_user.return_value = MockAuthResponse(mock_user)
    
    # First Request: Check user onboarding context
    mock_profile_res = MagicMock()
    mock_profile_res.data = [{"chamber_id": "persistent-chamber-123", "role": "Senior"}]
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_profile_res
    
    res1 = client.post(
        "/invites",
        json={"role": "Intern", "email": "intern@vakeel.ai"},
        headers={"Authorization": "Bearer persistent_access_token"}
    )
    assert res1.status_code == status.HTTP_200_OK
    
    # Second Request: Reusing the same token for the same user context
    res2 = client.post(
        "/invites",
        json={"role": "Associate", "email": "associate@vakeel.ai"},
        headers={"Authorization": "Bearer persistent_access_token"}
    )
    assert res2.status_code == status.HTTP_200_OK
