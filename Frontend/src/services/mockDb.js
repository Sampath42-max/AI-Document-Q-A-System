// Standalone Client-side Mock Database and Search Engine

const STORAGE_KEYS = {
  DOCUMENTS: 'doc_qa_documents',
  CHATS: 'doc_qa_chats'
};



class MockDatabase {
  constructor() {
    this.documents = this._load(STORAGE_KEYS.DOCUMENTS) || this._getInitialDocuments();
    this.chats = this._load(STORAGE_KEYS.CHATS) || {};
  }

  _load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load from localStorage', e);
      return null;
    }
  }

  _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  _getInitialDocuments() {
    return [];
  }

  // Get all documents for a user
  getDocuments(userId = 'default') {
    return this.documents.filter(doc => doc.userId === userId || !doc.userId);
  }

  // Add a document (parsed content)
  addDocument(name, content, size, type, userId = 'default', customId = null) {
    const id = customId || ('doc-' + Math.random().toString(36).substring(2, 11));
    
    // Split into paragraphs (by double newlines or single heading lines)
    const paragraphs = content
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 10); // Keep meaningful paragraphs

    const newDoc = {
      id,
      name,
      size,
      type,
      uploadedAt: new Date().toISOString(),
      status: 'indexed',
      content,
      paragraphs,
      userId
    };

    this.documents.unshift(newDoc);
    this._save(STORAGE_KEYS.DOCUMENTS, this.documents);
    return newDoc;
  }

  // Delete document
  deleteDocument(id) {
    this.documents = this.documents.filter(doc => doc.id !== id);
    this._save(STORAGE_KEYS.DOCUMENTS, this.documents);
    if (this.chats[id]) {
      delete this.chats[id];
      this._save(STORAGE_KEYS.CHATS, this.chats);
    }
    return true;
  }

  // Get chat history for a document
  getChats(docId) {
    return this.chats[docId] || [];
  }

  // Save chat history for a document
  saveChats(docId, messages) {
    this.chats[docId] = messages;
    this._save(STORAGE_KEYS.CHATS, this.chats);
  }

  // Clear chat history for a document
  clearChats(docId) {
    this.chats[docId] = [];
    this._save(STORAGE_KEYS.CHATS, this.chats);
  }

}

export const mockDb = new MockDatabase();
