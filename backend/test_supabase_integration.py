import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# Helper to check if credentials are set
def has_credentials():
    return bool(os.environ.get("SUPABASE_URL") and os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))

pytestmark = pytest.mark.skipif(
    not has_credentials(),
    reason="SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured for live integration tests"
)

def test_live_login_persistence_token_reuse():
    """
    Integration test validating token persistence. Reuses the active token
    across separate requests to ensure session verification is stateless and repeatable.
    """
    token = os.environ.get("TEST_USER_TOKEN")
    if not token:
        pytest.skip("TEST_USER_TOKEN environment variable not set for live token integration testing")
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # First Request
    res1 = client.post("/chambers", json={"name": "Integration Chamber 1"}, headers=headers)
    # May succeed or fail (e.g. if chamber already exists), but should not throw token/server errors
    assert res1.status_code != 401
    
    # Second Request using the same persistent token
    res2 = client.post("/invites", json={"role": "Intern", "email": "intern_persist@vakeel.ai"}, headers=headers)
    assert res2.status_code != 401
