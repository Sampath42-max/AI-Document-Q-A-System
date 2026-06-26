// Hybrid Service: Backend API Adapter with Client-side Mock Fallback
import { mockDb } from './mockDb';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.isOffline = true;
    this.lastSuccessTime = 0;
    this.statusListeners = [];
    this.checkConnection();
    // Re-check periodically
    setInterval(() => this.checkConnection(), 15000);
  }

  // Subscribe to connectivity changes
  onStatusChange(callback) {
    this.statusListeners.push(callback);
    callback(this.isOffline); // Initial notify
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.statusListeners.forEach(listener => listener(this.isOffline));
  }

  async checkConnection() {
    try {
      // Try to ping the backend app
      const response = await fetch(`${BACKEND_URL}/`, { method: 'GET', mode: 'cors' });
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
    } catch (e) {
      // Only set offline if no successful request has happened in the last 30 seconds
      if (Date.now() - this.lastSuccessTime > 30000) {
        const wasOffline = this.isOffline;
        this.isOffline = true;
        if (!wasOffline) this.notifyListeners();
      }
    }
  }

  getAuthHeaders() {
    const user = this.getCurrentUser();
    return user ? { 'X-User-Id': user.id } : {};
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('docai_user') || 'null');
  }

  logout() {
    localStorage.removeItem('docai_user');
  }

  async login(email, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
      }
      const userData = await response.json();
      localStorage.setItem('docai_user', JSON.stringify(userData));
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return userData;
    } catch (error) {
      console.warn('[API] Login failed on backend, trying mock fallback:', error.message);
      
      // If the server actually responded with a validation/credential error, don't fall back
      const isNetworkError = error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch');
      if (!isNetworkError && error.message !== 'Login failed') {
        throw error;
      }
      
      this.isOffline = true;
      this.notifyListeners();
      return this.loginMock(email, email.split('@')[0]);
    }
  }

  async signup(email, password, name) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Signup failed');
      }
      const userData = await response.json();
      localStorage.setItem('docai_user', JSON.stringify(userData));
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return userData;
    } catch (error) {
      console.warn('[API] Signup failed on backend, trying mock fallback:', error.message);
      
      const isNetworkError = error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch');
      if (!isNetworkError && error.message !== 'Signup failed') {
        throw error;
      }
      
      this.isOffline = true;
      this.notifyListeners();
      return this.loginMock(email, name);
    }
  }

  async loginMock(email, name) {
    const mockUser = {
      id: `mock-${email}`,
      email,
      name,
      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    };
    localStorage.setItem('docai_user', JSON.stringify(mockUser));
    return mockUser;
  }

  async loginWithGoogle(credential) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Google login failed');
      }
      const userData = await response.json();
      localStorage.setItem('docai_user', JSON.stringify(userData));
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return userData;
    } catch (error) {
      console.warn('[API] Google login failed on backend, trying mock fallback:', error.message);
      
      this.isOffline = true;
      this.notifyListeners();
      try {
        const payload = JSON.parse(atob(credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const mockUser = {
          id: `google-${payload.sub || payload.email}`,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          picture: payload.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
        };
        localStorage.setItem('docai_user', JSON.stringify(mockUser));
        return mockUser;
      } catch (e) {
        return this.loginMock('google-user@example.com', 'Google User');
      }
    }
  }

  // 1. Get List of Documents
  async getDocuments() {
    const user = this.getCurrentUser();
    const userId = user ? user.id : 'default';

    try {
      const response = await fetch(`${BACKEND_URL}/documents`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return data;
    } catch (error) {
      console.error('[API] Error in getDocuments, falling back to mock:', error);
      
      // Keep isOffline flag updated
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      return mockDb.getDocuments(userId);
    }
  }

  // 2. Upload Document
  async uploadDocument(file, onProgress) {
    // Read local file contents if text, markdown or json to feed the mock vector store
    let fileContent = '';
    const isTextFile = file.type === 'text/plain' || 
                       file.name.endsWith('.md') || 
                       file.name.endsWith('.json') || 
                       file.name.endsWith('.csv');

    if (isTextFile) {
      fileContent = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });
    } else {
      fileContent = `# Mock Text Content for ${file.name}\n\nThis is a binary file (PDF/Docx/etc.) parsed client-side. Detailed mock responses will be simulated for this document.`;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (onProgress) onProgress(40);
      
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (onProgress) onProgress(100);

      if (!response.ok) throw new Error('Upload failed on server');
      const data = await response.json();
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      // Also register it locally just in case we need content backup
      const user = this.getCurrentUser();
      const userId = user ? user.id : 'default';
      const localDoc = mockDb.addDocument(file.name, fileContent, file.size, file.type, userId, data.doc_id);
      
      return {
        ...localDoc,
        ...data
      };
    } catch (error) {
      console.error('[API] Error in uploadDocument, falling back to mock:', error);
      
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      // Simulate network uploading progress for mock
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 150);

      const user = this.getCurrentUser();
      const userId = user ? user.id : 'default';
      await new Promise(resolve => setTimeout(resolve, 800)); // Sim processing latency
      return mockDb.addDocument(file.name, fileContent, file.size, file.type, userId);
    }
  }

  // 3. Delete Document
  async deleteDocument(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/document/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete document');
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      mockDb.deleteDocument(id); // sync local
      return true;
    } catch (error) {
      console.error('[API] Error in deleteDocument, falling back to mock:', error);
      
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      return mockDb.deleteDocument(id);
    }
  }

  // 4. Query / Chat with Document
  async queryDocument(docId, query, onChunk) {
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ document_id: docId, question: query, query })
      });

      if (!response.ok) throw new Error('Chat request failed');
      const data = await response.json();
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      // Save history locally as backup
      const history = mockDb.getChats(docId);
      const newMessages = [
        ...history,
        { role: 'user', content: query, timestamp: new Date().toISOString() },
        { role: 'assistant', content: data.answer, citations: data.citations || [], timestamp: new Date().toISOString() }
      ];
      mockDb.saveChats(docId, newMessages);

      if (onChunk) {
        onChunk({
          answer: data.answer,
          citations: data.citations || [],
          done: true
        });
      }

      return data;
    } catch (error) {
      console.error('[API] Error in queryDocument:', error);
      
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      throw error;
    }
  }

  // 5. Get Chats History
  async getChats(docId) {
    try {
      const response = await fetch(`${BACKEND_URL}/history/${docId}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return data;
    } catch (error) {
      console.error('[API] Error fetching chats, using mock:', error);
      
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      return mockDb.getChats(docId);
    }
  }

  // 6. Clear Chats
  async clearChats(docId) {
    mockDb.clearChats(docId); // sync local
    try {
      const response = await fetch(`${BACKEND_URL}/history/${docId}`, { 
        method: 'DELETE', 
        headers: this.getAuthHeaders() 
      });
      if (!response.ok) throw new Error('Failed to clear chats');
      
      const wasOffline = this.isOffline;
      this.isOffline = false;
      this.lastSuccessTime = Date.now();
      if (wasOffline) this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('[API] Error clearing chats on backend:', error);
      
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
      
      return true; // return true anyway since local is cleared
    }
  }
}

export const apiService = new ApiService();
export { BACKEND_URL };
