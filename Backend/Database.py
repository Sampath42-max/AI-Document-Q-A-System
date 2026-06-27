import os
import json
import threading
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "database.json")
db_lock = threading.Lock()

def _read_db():
    if not os.path.exists(DB_FILE):
        return {"users": {}, "documents": {}, "chats": {}}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return {"users": {}, "documents": {}, "chats": {}}

def _write_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def init_db():
    with db_lock:
        if not os.path.exists(DB_FILE):
            _write_db({"users": {}, "documents": {}, "chats": {}})
        data = _read_db()
        if "default" not in data.get("users", {}):
            if "users" not in data:
                data["users"] = {}
            data["users"]["default"] = {
                "id": "default",
                "email": "default@docai.com",
                "name": "Default User",
                "picture": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            }
            _write_db(data)

def create_db_user(email: str, password: str, name: str):
    # Stub implementation since Email/Password auth is removed
    return None

def authenticate_db_user(email: str, password: str):
    # Stub implementation since Email/Password auth is removed
    return None

def save_or_update_user(google_id: str, email: str, name: str, picture: str):
    with db_lock:
        data = _read_db()
        if "users" not in data:
            data["users"] = {}
        
        user = data["users"].get(google_id)
        if not user:
            # Check by email to merge accounts
            existing_id = None
            for uid, udata in data["users"].items():
                if udata.get("email") == email:
                    existing_id = uid
                    break
            
            if existing_id:
                # Merge documents user_id
                if "documents" in data:
                    for doc_id, doc in data["documents"].items():
                        if doc.get("user_id") == existing_id:
                            doc["user_id"] = google_id
                
                # Copy old user data
                old_user = data["users"].pop(existing_id)
                user = {
                    "id": google_id,
                    "email": email,
                    "name": name,
                    "picture": picture or old_user.get("picture", "")
                }
            else:
                user = {
                    "id": google_id,
                    "email": email,
                    "name": name,
                    "picture": picture
                }
        else:
            user["name"] = name
            if picture:
                user["picture"] = picture

        data["users"][google_id] = user
        _write_db(data)
        return user

def save_document(doc_id: str, name: str, size: int, doc_type: str, content: str, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        if "users" not in data:
            data["users"] = {}
        if "documents" not in data:
            data["documents"] = {}

        if user_id not in data["users"]:
            data["users"][user_id] = {
                "id": user_id,
                "email": f"{user_id}@gmail.com",
                "name": user_id,
                "picture": ""
            }

        uploaded_at = datetime.utcnow().isoformat() + "Z"
        doc = {
            "id": doc_id,
            "name": name,
            "size": size,
            "type": doc_type,
            "uploadedAt": uploaded_at,
            "status": "indexed",
            "content": content,
            "user_id": user_id
        }
        data["documents"][doc_id] = doc
        _write_db(data)

        paragraphs = [p.strip() for p in content.split("\n\n") if len(p.strip()) > 10]
        return {
            "id": doc_id,
            "name": name,
            "size": size,
            "type": doc_type,
            "uploadedAt": uploaded_at,
            "status": "indexed",
            "content": content,
            "paragraphs": paragraphs
        }

def get_documents(user_id: str = "default"):
    with db_lock:
        data = _read_db()
        docs = data.get("documents", {})
        result = []
        for d in docs.values():
            if d.get("user_id") == user_id:
                paragraphs = [p.strip() for p in d.get("content", "").split("\n\n") if len(p.strip()) > 10]
                result.append({
                    "id": d.get("id"),
                    "name": d.get("name"),
                    "size": d.get("size"),
                    "type": d.get("type"),
                    "uploadedAt": d.get("uploadedAt"),
                    "status": d.get("status"),
                    "content": d.get("content"),
                    "paragraphs": paragraphs
                })
        # Sort by uploadedAt desc
        result.sort(key=lambda x: x["uploadedAt"], reverse=True)
        return result

def get_document(doc_id: str, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        doc = data.get("documents", {}).get(doc_id)
        if not doc:
            return None
        paragraphs = [p.strip() for p in doc.get("content", "").split("\n\n") if len(p.strip()) > 10]
        return {
            "id": doc.get("id"),
            "name": doc.get("name"),
            "size": doc.get("size"),
            "type": doc.get("type"),
            "uploadedAt": doc.get("uploadedAt"),
            "status": doc.get("status"),
            "content": doc.get("content"),
            "paragraphs": paragraphs
        }

def delete_document(doc_id: str, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        if "documents" in data and doc_id in data["documents"]:
            del data["documents"][doc_id]
        if "chats" in data and doc_id in data["chats"]:
            del data["chats"][doc_id]
        _write_db(data)

def save_chat_message(doc_id: str, role: str, content: str, citations: list = None, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        if "chats" not in data:
            data["chats"] = {}
        if doc_id not in data["chats"]:
            data["chats"][doc_id] = []

        timestamp = datetime.utcnow().isoformat() + "Z"
        chat = {
            "role": role,
            "content": content,
            "citations": citations or [],
            "timestamp": timestamp
        }
        data["chats"][doc_id].append(chat)
        _write_db(data)

def get_chats(doc_id: str, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        chats = data.get("chats", {}).get(doc_id, [])
        return chats

def clear_chats(doc_id: str, user_id: str = "default"):
    with db_lock:
        data = _read_db()
        if "chats" in data and doc_id in data["chats"]:
            data["chats"][doc_id] = []
            _write_db(data)
