import firebase_admin
from firebase_admin import credentials, storage
import os

cred_path = os.path.join(os.path.dirname(__file__), "firebase-service-account.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'vakeel-7aaf8.appspot.com'
})

bucket = storage.bucket()
bucket.cors = [{
    "origin": ["*"],
    "responseHeader": ["*"],
    "method": ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600
}]
bucket.patch()
print("CORS rules updated successfully for bucket!")
