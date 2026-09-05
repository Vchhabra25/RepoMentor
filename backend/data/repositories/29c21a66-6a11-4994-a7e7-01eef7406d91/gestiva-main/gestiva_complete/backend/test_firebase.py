from firebase import db

db.collection("test").document("hello").set({
    "message": "Firebase Connected Successfully!"
})

print("Firebase Connected Successfully!")