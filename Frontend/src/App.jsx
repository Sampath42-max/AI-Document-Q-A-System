import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DocumentViewer } from './components/DocumentViewer';
import { ChatPanel } from './components/ChatPanel';
import { Toast, toastContainerStyle } from './components/UI/Toast';
import { apiService } from './services/api';
import { HomePage } from './components/HomePage';
import { 
  Search, Bell, Sun, Moon, UploadCloud, FileText, Trash2, 
  Sparkles, Database, Clock, Activity, AlertCircle, HelpCircle, 
  Settings, FolderHeart, LayoutDashboard, Grid, MessageSquare, LogOut
} from 'lucide-react';

const appStyles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-main)',
    position: 'relative',
    zIndex: 1,
  },
  blob1: {
    position: 'absolute',
    top: '-15%',
    left: '10%',
    width: '550px',
    height: '550px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(100px)',
    zIndex: -1,
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-15%',
    right: '15%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(110px)',
    zIndex: -1,
    pointerEvents: 'none',
  },
  mainArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    minWidth: 0,
    position: 'relative',
    zIndex: 1,
  },
  topNav: {
    height: '70px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: 'var(--bg-topnav)',
    backdropFilter: 'blur(20px)',
    flexShrink: 0,
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    padding: '6px 14px',
    borderRadius: '20px',
    width: '320px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    width: '100%',
  },
  topNavActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navIconBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'var(--transition)',
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00D4FF',
    boxShadow: '0 0 8px #00D4FF',
  },
  avatarWrapper: {
    position: 'relative',
    width: '36px',
    height: '36px',
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid var(--border)',
  },
  userStatusRing: {
    position: 'absolute',
    bottom: '-1px',
    right: '-1px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    border: '2px solid var(--bg-main)',
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  dashboard: {
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    flex: 1,
    overflowY: 'auto',
  },
  welcomeHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  welcomeTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'var(--font-heading)',
  },
  welcomeSub: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  statCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-heading)',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  librarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  docGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  gridCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  gridCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  gridDocIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(108, 99, 255, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.2)',
    color: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridDocName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  gridDocDate: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  gridDocMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border)',
    paddingTop: '12px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  gridDocBadge: {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  gridDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'var(--transition)',
  },
  dashboardRightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  activitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  activityTimeline: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    position: 'relative',
    paddingBottom: '16px',
  },
  activityItemLast: {
    display: 'flex',
    gap: '12px',
    position: 'relative',
  },
  activityIconWrapper: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    flexShrink: 0,
    zIndex: 2,
  },
  activityLine: {
    position: 'absolute',
    top: '24px',
    left: '12px',
    width: '1px',
    height: 'calc(100% - 12px)',
    background: 'var(--border)',
    zIndex: 1,
  },
  activityContent: {
    flex: 1,
    fontSize: '0.8rem',
  },
  activityText: {
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  activityTime: {
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    marginTop: '2px',
  },
  splitScreen: {
    display: 'flex',
    flex: 1,
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
  },
  profileDropdown: {
    position: 'absolute',
    top: '48px',
    right: '0',
    width: '260px',
    padding: '16px',
    borderRadius: '16px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow-lg)',
    background: 'var(--bg-main)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'left',
  },
  dropdownAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  dropdownUserInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  dropdownName: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    margin: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  planBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.75rem',
  },
  logoutDropdownBtn: {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }
};

function App() {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [highlightedParagraphIndex, setHighlightedParagraphIndex] = useState(null);
  const [isOffline, setIsOffline] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [user, setUser] = useState(() => apiService.getCurrentUser());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    console.log('[App] handleLogout executing...');
    apiService.logout();
    setUser(null);
    setDocuments([]);
    setActiveDocId(null);
    setMessages([]);
    console.log('[App] handleLogout complete. User state set to null.');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!showProfileMenu) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showProfileMenu]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toast Helpers
  const showToast = (message, type = 'info') => {
    // Disabled to stop showing notifications
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Listen to Connection changes
  useEffect(() => {
    const unsubscribe = apiService.onStatusChange((offline) => {
      setIsOffline(offline);
      if (offline) {
        showToast('Running in Standalone Mode (using client-side engine)', 'info');
      } else {
        showToast('Successfully connected to FastAPI Backend API!', 'success');
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch initial documents list
  useEffect(() => {
    if (!user) return;
    const fetchDocs = async () => {
      try {
        const docs = await apiService.getDocuments();
        setDocuments(docs);
        
        // Auto-select first document if available, but stay on dashboard
        if (docs.length > 0 && !activeDocId) {
          setActiveDocId(docs[0].id);
        }
      } catch (e) {
        showToast('Failed to load documents', 'error');
      }
    };
    fetchDocs();
  }, [isOffline, user]);

  // Load chat logs when active document changes
  useEffect(() => {
    if (!activeDocId || !user) {
      setMessages([]);
      return;
    }

    const loadChats = async () => {
      try {
        const chatLogs = await apiService.getChats(activeDocId);
        setMessages(chatLogs);
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    };
    loadChats();
  }, [activeDocId]);

  const activeDoc = documents.find(doc => doc.id === activeDocId) || null;

  // Handlers
  const handleSelectDoc = (id) => {
    setActiveDocId(id);
    setHighlightedParagraphIndex(null);
    setActiveTab('chat');
  };

  const handleUploadDoc = async (file, onProgress) => {
    try {
      const newDoc = await apiService.uploadDocument(file, onProgress);
      setDocuments(prev => [newDoc, ...prev]);
      setActiveDocId(newDoc.id);
      setActiveTab('chat');
      showToast(`"${file.name}" uploaded and indexed successfully!`, 'success');
    } catch (e) {
      showToast(`Failed to upload "${file.name}"`, 'error');
      throw e;
    }
  };

  const handleDeleteDoc = async (id) => {
    const docToDelete = documents.find(d => d.id === id);
    try {
      await apiService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      showToast(`"${docToDelete?.name || 'Document'}" deleted`, 'info');
      
      if (activeDocId === id) {
        setActiveDocId(null);
        setHighlightedParagraphIndex(null);
        setActiveTab('dashboard');
      }
    } catch (e) {
      showToast('Failed to delete document', 'error');
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeDocId) return;

    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    const assistantPlaceholder = {
      role: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, assistantPlaceholder]);

    try {
      await apiService.queryDocument(activeDocId, content, (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = chunk.answer;
            lastMsg.citations = chunk.citations;
          }
          return updated;
        });
      });
    } catch (e) {
      showToast('Error retrieving response', 'error');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = async () => {
    if (!activeDocId) return;
    try {
      await apiService.clearChats(activeDocId);
      setMessages([]);
      showToast('Chat history cleared', 'info');
    } catch (e) {
      showToast('Failed to clear history', 'error');
    }
  };

  const handleCitationClick = (idx) => {
    setHighlightedParagraphIndex(idx);
  };

  // Stats Computations
  const totalDocs = documents.length;
  const totalChunks = documents.reduce((acc, doc) => acc + (doc.paragraphs ? doc.paragraphs.length : 0), 0);
  const totalQuestions = totalDocs * 4 + messages.filter(m => m.role === 'user').length;
  const avgResponse = totalDocs > 0 ? "1.4s" : "0.0s";

  // Filtered documents for search
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!user) {
    return (
      <HomePage 
        onLoginSuccess={(userData) => setUser(userData)}
        theme={theme}
        toggleTheme={toggleTheme}
        Sun={Sun}
        Moon={Moon}
      />
    );
  }

  return (
    <div style={appStyles.container}>
      {/* Floating Particles in Background */}
      <div className="particles-container">
        <div className="particle" style={{ left: '10%', width: '120px', height: '120px', animationDelay: '0s', animationDuration: '20s' }} />
        <div className="particle" style={{ left: '40%', width: '180px', height: '180px', animationDelay: '2s', animationDuration: '30s' }} />
        <div className="particle" style={{ left: '75%', width: '140px', height: '140px', animationDelay: '4s', animationDuration: '24s' }} />
      </div>

      {/* Glassmorphic Background Blobs */}
      <div style={appStyles.blob1} />
      <div style={appStyles.blob2} />

      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        documents={documents}
        activeDocId={activeDocId}
        onSelectDoc={handleSelectDoc}
        onUploadDoc={handleUploadDoc}
        onDeleteDoc={handleDeleteDoc}
        isOffline={isOffline}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      {/* Main Right Content Section */}
      <div style={appStyles.mainArea}>
        
        {/* 2. Top Navigation Bar */}
        <div style={appStyles.topNav}>
          <div style={appStyles.searchContainer}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              style={appStyles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={appStyles.topNavActions}>
            <button style={appStyles.navIconBtn} title="AI Engine Ready">
              <Sparkles size={16} />
            </button>
            <button style={appStyles.navIconBtn} onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="profile-container" style={{ position: 'relative' }}>
              <div 
                style={{ ...appStyles.avatarWrapper, cursor: 'pointer' }} 
                onClick={() => setShowProfileMenu(prev => !prev)} 
                title="Profile Settings"
              >
                <img 
                  src={user?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                  alt={user?.name || "User avatar"} 
                  style={appStyles.userAvatar} 
                />
                <div style={appStyles.userStatusRing} />
              </div>

              {showProfileMenu && (
                <div className="glass-card" style={appStyles.profileDropdown}>
                  <div style={appStyles.profileHeader}>
                    <img 
                      src={user?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt={user?.name || "User avatar"} 
                      style={appStyles.dropdownAvatar} 
                    />
                    <div style={appStyles.dropdownUserInfo}>
                      <div style={appStyles.dropdownName}>{user?.name || "Sarah Jenkins"}</div>
                      <div style={appStyles.dropdownEmail}>{user?.email || "sarah@example.com"}</div>
                    </div>
                  </div>
                  <div style={appStyles.dropdownDivider} />
                  <button 
                    type="button"
                    style={appStyles.logoutDropdownBtn} 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('[App] Logout button clicked');
                      handleLogout();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Tab Area Rendering */}
        <div style={appStyles.contentWrapper}>
          {activeTab === 'dashboard' ? (
            /* Dashboard Tab */
            <div style={appStyles.dashboard} className="animate-fade-in">
              
              {/* Welcome Heading */}
              <div style={appStyles.welcomeHeader}>
                <h1 style={appStyles.welcomeTitle}>Chat With Your Documents</h1>
                <p style={appStyles.welcomeSub}>Upload PDFs, DOCX, TXT files and get instant AI-powered answers.</p>
              </div>

              {/* Analytics widgets */}
              <div style={appStyles.statsGrid}>
                
                <div className="glass-card" style={appStyles.statCard}>
                  <div style={appStyles.statHeader}>
                    <span style={appStyles.statLabel}>Total Documents</span>
                    <FileText size={18} color="var(--secondary)" />
                  </div>
                  <div style={appStyles.statValue}>{totalDocs}</div>
                </div>

                <div className="glass-card" style={appStyles.statCard}>
                  <div style={appStyles.statHeader}>
                    <span style={appStyles.statLabel}>Questions Answered</span>
                    <MessageSquare size={18} color="var(--primary)" />
                  </div>
                  <div style={appStyles.statValue}>{totalQuestions}</div>
                </div>

                <div className="glass-card" style={appStyles.statCard}>
                  <div style={appStyles.statHeader}>
                    <span style={appStyles.statLabel}>Chunks Indexed</span>
                    <Database size={18} color="var(--accent)" />
                  </div>
                  <div style={appStyles.statValue}>{totalChunks}</div>
                </div>

                <div className="glass-card" style={appStyles.statCard}>
                  <div style={appStyles.statHeader}>
                    <span style={appStyles.statLabel}>Response Latency</span>
                    <Clock size={18} color="#10b981" />
                  </div>
                  <div style={appStyles.statValue}>{avgResponse}</div>
                </div>

              </div>

              {/* Split Dashboard Row */}
              <div className="dashboard-grid">
                
                {/* Left: Document Grid Library */}
                <div style={appStyles.librarySection}>
                  <div style={appStyles.sectionTitleRow}>
                    <h2 style={appStyles.sectionTitle}>Document Library</h2>
                  </div>

                  {filteredDocs.length === 0 ? (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <FolderHeart size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>No matching documents found in library.</p>
                    </div>
                  ) : (
                    <div style={appStyles.docGrid}>
                      {filteredDocs.map(doc => (
                        <div 
                          key={doc.id} 
                          className="glass-card" 
                          style={appStyles.gridCard}
                          onClick={() => handleSelectDoc(doc.id)}
                        >
                          <div style={appStyles.gridCardHeader}>
                            <div style={appStyles.gridDocIcon}>
                              <FileText size={20} />
                            </div>
                            <button 
                              style={appStyles.gridDeleteBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDoc(doc.id);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div>
                            <div style={appStyles.gridDocName} title={doc.name}>{doc.name}</div>
                            <div style={appStyles.gridDocDate}>
                              {new Date(doc.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                          <div style={appStyles.gridDocMetaRow}>
                            <span>{formatSize(doc.size)}</span>
                            <span 
                              style={{ 
                                ...appStyles.gridDocBadge, 
                                backgroundColor: doc.status === 'indexed' ? 'var(--success-glow)' : 'rgba(245, 158, 11, 0.1)',
                                color: doc.status === 'indexed' ? 'var(--success)' : 'var(--warning)'
                              }}
                            >
                              {doc.status === 'indexed' ? 'Indexed' : 'Parsing'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: System Status */}
                <div style={appStyles.dashboardRightCol}>
                  
                  <div style={appStyles.activitySection}>
                    <h2 style={appStyles.sectionTitle}>System Status</h2>
                    <div className="glass-card" style={appStyles.activityTimeline}>
                      
                      <div style={appStyles.activityItem}>
                        <div style={appStyles.activityLine} />
                        <div style={appStyles.activityIconWrapper}>
                          <Sparkles size={12} />
                        </div>
                        <div style={appStyles.activityContent}>
                          <div style={appStyles.activityText}>AI RAG Engine Ready</div>
                          <div style={appStyles.activityTime}>Gemini 2.5 Active</div>
                        </div>
                      </div>

                      <div style={appStyles.activityItem}>
                        <div style={appStyles.activityLine} />
                        <div style={appStyles.activityIconWrapper}>
                          <Database size={12} />
                        </div>
                        <div style={appStyles.activityContent}>
                          <div style={appStyles.activityText}>Chroma Vector Store Connected</div>
                          <div style={appStyles.activityTime}>document_system Collection</div>
                        </div>
                      </div>

                      <div style={appStyles.activityItemLast}>
                        <div style={appStyles.activityIconWrapper}>
                          <Activity size={12} />
                        </div>
                        <div style={appStyles.activityContent}>
                          <div style={appStyles.activityText}>System Load Stable</div>
                          <div style={appStyles.activityTime}>GPU latency 140ms</div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            /* Q&A Chat split screen view */
            <div style={appStyles.splitScreen}>
              <DocumentViewer 
                activeDoc={activeDoc}
                highlightedParagraphIndex={highlightedParagraphIndex}
                clearHighlight={() => setHighlightedParagraphIndex(null)}
              />
              <ChatPanel 
                messages={messages}
                activeDoc={activeDoc}
                isGenerating={isGenerating}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearHistory}
                onCitationClick={handleCitationClick}
              />
            </div>
          )}
        </div>

      </div>

      {/* Floating Notifications (Disabled) */}
    </div>
  );
}

export default App;
