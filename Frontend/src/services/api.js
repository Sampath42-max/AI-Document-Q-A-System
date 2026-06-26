// Hybrid Service: Backend API Adapter with Client-side Mock Fallback
import { mockDb } from './mockDb';

const BACKEND_URL = 'http://localhost:8000'; // Default FastAPI address

class ApiService {
  constructor() {
    this.isOffline = true;
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
      if (wasOffline) this.notifyListeners();
    } catch (e) {
      const wasOffline = this.isOffline;
      this.isOffline = true;
      if (!wasOffline) this.notifyListeners();
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
    if (this.isOffline) {
      console.log('[API] Server offline, simulating login with mock credentials');
      return this.loginMock(email, email.split('@')[0]);
    }
    
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
    return userData;
  }

  async signup(email, password, name) {
    if (this.isOffline) {
      console.log('[API] Server offline, simulating signup with mock credentials');
      return this.loginMock(email, name);
    }
    
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
    return userData;
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
    if (this.isOffline) {
      console.log('[API] Server offline, simulating Google login with mock credential');
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
    return userData;
  }

  // 1. Get List of Documents
  async getDocuments() {
    const user = this.getCurrentUser();
    const userId = user ? user.id : 'default';
    if (this.isOffline) {
      console.log('[API] Server offline, using Mock DB for getDocuments');
      return mockDb.getDocuments(userId);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/documents`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    } catch (error) {
      console.error('[API] Error in getDocuments, falling back to mock:', error);
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

    if (this.isOffline) {
      console.log('[API] Server offline, using Mock DB for uploadDocument');
      
      // Simulate network uploading progress
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

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simple fetch doesn't support progress, but we can mock progress up to 90% and snap to 100%
      if (onProgress) onProgress(40);
      
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (onProgress) onProgress(100);

      if (!response.ok) throw new Error('Upload failed on server');
      const data = await response.json();
      
      // Also register it locally just in case we need content backup
      const localDoc = mockDb.addDocument(file.name, fileContent, file.size, file.type, data.doc_id);
      
      return {
        ...localDoc,
        ...data
      };
    } catch (error) {
      console.error('[API] Error in uploadDocument, falling back to mock:', error);
      return mockDb.addDocument(file.name, fileContent, file.size, file.type);
    }
  }

  // 3. Delete Document
  async deleteDocument(id) {
    if (this.isOffline) {
      console.log('[API] Server offline, using Mock DB for deleteDocument');
      return mockDb.deleteDocument(id);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/document/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete document');
      mockDb.deleteDocument(id); // sync local
      return true;
    } catch (error) {
      console.error('[API] Error in deleteDocument, falling back to mock:', error);
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
      throw error;
    }
  }

  // 5. Get Chats History
  async getChats(docId) {
    if (this.isOffline) {
      return mockDb.getChats(docId);
    }
    try {
      const response = await fetch(`${BACKEND_URL}/history/${docId}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return await response.json();
    } catch (error) {
      console.error('[API] Error fetching chats, using mock:', error);
      return mockDb.getChats(docId);
    }
  }

  // 6. Clear Chats
  async clearChats(docId) {
    mockDb.clearChats(docId); // sync local
    if (this.isOffline) return true;

    try {
      await fetch(`${BACKEND_URL}/history/${docId}`, { 
        method: 'DELETE', 
        headers: this.getAuthHeaders() 
      });
      return true;
    } catch (error) {
      console.error('[API] Error clearing chats on backend:', error);
      return true; // return true anyway since local is cleared
    }
  }
}

export const apiService = new ApiService();
export { BACKEND_URL };
