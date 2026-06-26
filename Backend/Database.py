from sqlalchemy import create_engine, Column, String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy.sql import text
from datetime import datetime
import json
import os
import urllib.parse
import bcrypt
import uuid
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String(255), primary_key=True)  # Google User ID / sub / Custom UUID
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    picture = Column(String(500))
    password_hash = Column(String(255), nullable=True) # password hash for normal login
    created_at = Column(DateTime, default=datetime.utcnow)
    
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = 'documents'
    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    size = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)
    uploadedAt = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    content = Column(Text(length=16777215), nullable=False)  # MEDIUMTEXT in MySQL
    user_id = Column(String(255), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    user = relationship("User", back_populates="documents")
    chats = relationship("Chat", back_populates="document", cascade="all, delete-orphan")

class Chat(Base):
    __tablename__ = 'chats'
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(255), ForeignKey('documents.id', ondelete='CASCADE'), nullable=False)
    role = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    citations = Column(Text)  # JSON string
    timestamp = Column(String(100), nullable=False)
    
    document = relationship("Document", back_populates="chats")

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Sampath111@")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "doc_ai")


# URL encode the username and password (to handle special characters like spaces or '@')
encoded_user = urllib.parse.quote_plus(DB_USER)
encoded_password = urllib.parse.quote_plus(DB_PASSWORD)

DATABASE_URL = f"mysql+pymysql://{encoded_user}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = None
SessionLocal = None

def init_db():
    global engine, SessionLocal
    
    # Try to connect to MySQL and create database if not exists
    try:
        base_url = f"mysql+pymysql://{encoded_user}:{encoded_password}@{DB_HOST}:{DB_PORT}/"
        print(f"[Database] Connecting to MySQL at {DB_HOST}:{DB_PORT} to check/create database '{DB_NAME}'...")
        temp_engine = create_engine(base_url, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}`"))
        temp_engine.dispose()
        
        # Connect to the MySQL database
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            pass
        print(f"[Database] Successfully connected to MySQL database '{DB_NAME}' on port {DB_PORT}!")
    except Exception as e:
        print(f"[Database] Error: Could not connect to MySQL server at {DB_HOST}:{DB_PORT}. SQLite fallback is disabled.")
        raise e
        
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Check/Migrate: Add password_hash column to users table if not exists
    with engine.begin() as conn:
        try:
            conn.execute(text("SELECT password_hash FROM users LIMIT 1"))
        except Exception:
            print("[Database] Adding password_hash column to users table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL"))
    
    # Ensure default user exists
    db = SessionLocal()
    try:
        default_user = db.query(User).filter(User.id == "default").first()
        if not default_user:
            default_user = User(
                id="default",
                email="default@docai.com",
                name="Default User",
                picture="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            )
            db.add(default_user)
            db.commit()
    except Exception as e:
        print(f"[Database] Error creating default user: {e}")
        db.rollback()
    finally:
        db.close()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    if not hashed:
        return False
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_db_user(email: str, password: str, name: str):
    db = SessionLocal()
    try:
        # Check if user already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return None
        
        user_id = str(uuid.uuid4())
        hashed = hash_password(password)
        user = User(
            id=user_id,
            email=email,
            name=name,
            password_hash=hashed,
            picture=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "picture": user.picture
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def authenticate_db_user(email: str, password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user or not user.password_hash:
            return None
        
        if verify_password(password, user.password_hash):
            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture
            }
        return None
    except Exception as e:
        raise e
    finally:
        db.close()

def save_or_update_user(google_id: str, email: str, name: str, picture: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == google_id).first()
        if not user:
            # Check by email to merge accounts
            user = db.query(User).filter(User.email == email).first()
            if user:
                old_id = user.id
                # Temporarily disable foreign key checks to perform primary key mutation on parent and child tables
                db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
                try:
                    db.execute(
                        text("UPDATE documents SET user_id = :new_id WHERE user_id = :old_id"),
                        {"new_id": google_id, "old_id": old_id}
                    )
                    db.execute(
                        text("UPDATE users SET id = :new_id, picture = :picture WHERE id = :old_id"),
                        {"new_id": google_id, "picture": picture, "old_id": old_id}
                    )
                    db.commit()
                finally:
                    db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
                
                # Fetch re-associated record
                user = db.query(User).filter(User.id == google_id).first()
            else:
                user = User(id=google_id, email=email, name=name, picture=picture)
                db.add(user)
        else:
            user.name = name
            if picture:
                user.picture = picture
        
        db.commit()
        db.refresh(user)
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "picture": user.picture
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def save_document(doc_id: str, name: str, size: int, doc_type: str, content: str, user_id: str = "default"):
    db = SessionLocal()
    try:
        # Ensure user exists (in case user_id is passed but user doesn't exist in DB)
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # Create a user record dynamically to prevent foreign key constraint failures
            user = User(id=user_id, email=f"{user_id}@gmail.com", name=user_id, picture="")
            db.add(user)
            db.commit()

        uploaded_at = datetime.utcnow().isoformat() + "Z"
        doc = Document(
            id=doc_id,
            name=name,
            size=size,
            type=doc_type,
            uploadedAt=uploaded_at,
            status="indexed",
            content=content,
            user_id=user_id
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        paragraphs = [p.strip() for p in content.split("\n\n") if len(p.strip()) > 10]
        return {
            "id": doc.id,
            "name": doc.name,
            "size": doc.size,
            "type": doc.type,
            "uploadedAt": doc.uploadedAt,
            "status": doc.status,
            "content": doc.content,
            "paragraphs": paragraphs
        }
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def get_documents(user_id: str = "default"):
    db = SessionLocal()
    try:
        docs = db.query(Document).filter(Document.user_id == user_id).order_by(Document.uploadedAt.desc()).all()
        result = []
        for d in docs:
            paragraphs = [p.strip() for p in d.content.split("\n\n") if len(p.strip()) > 10]
            result.append({
                "id": d.id,
                "name": d.name,
                "size": d.size,
                "type": d.type,
                "uploadedAt": d.uploadedAt,
                "status": d.status,
                "content": d.content,
                "paragraphs": paragraphs
            })
        return result
    finally:
        db.close()

def get_document(doc_id: str, user_id: str = "default"):
    db = SessionLocal()
    try:
        # Try to find document belonging to this user
        d = db.query(Document).filter(Document.id == doc_id, Document.user_id == user_id).first()
        if not d:
            # Fallback to general lookup (for legacy or public documents)
            d = db.query(Document).filter(Document.id == doc_id).first()
            if not d:
                return None
        paragraphs = [p.strip() for p in d.content.split("\n\n") if len(p.strip()) > 10]
        return {
            "id": d.id,
            "name": d.name,
            "size": d.size,
            "type": d.type,
            "uploadedAt": d.uploadedAt,
            "status": d.status,
            "content": d.content,
            "paragraphs": paragraphs
        }
    finally:
        db.close()

def delete_document(doc_id: str, user_id: str = "default"):
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == user_id).first()
        if not doc:
            doc = db.query(Document).filter(Document.id == doc_id).first()
        if doc:
            db.delete(doc)
            db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def save_chat_message(doc_id: str, role: str, content: str, citations: list = None, user_id: str = "default"):
    db = SessionLocal()
    try:
        timestamp = datetime.utcnow().isoformat() + "Z"
        citations_str = json.dumps(citations) if citations else None
        chat = Chat(
            document_id=doc_id,
            role=role,
            content=content,
            citations=citations_str,
            timestamp=timestamp
        )
        db.add(chat)
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def get_chats(doc_id: str, user_id: str = "default"):
    db = SessionLocal()
    try:
        chats = db.query(Chat).filter(Chat.document_id == doc_id).order_by(Chat.id.asc()).all()
        result = []
        for c in chats:
            citations = []
            if c.citations:
                try:
                    citations = json.loads(c.citations)
                except Exception:
                    pass
            result.append({
                "role": c.role,
                "content": c.content,
                "citations": citations,
                "timestamp": c.timestamp
            })
        return result
    finally:
        db.close()

def clear_chats(doc_id: str, user_id: str = "default"):
    db = SessionLocal()
    try:
        db.query(Chat).filter(Chat.document_id == doc_id).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
