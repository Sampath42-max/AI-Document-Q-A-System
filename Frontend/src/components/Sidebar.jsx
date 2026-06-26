import React, { useRef, useState } from 'react';
import { 
  UploadCloud, FileText, Trash2, Database, ShieldCheck, 
  Settings, Folder, LayoutDashboard, History, Layers, User, Activity
} from 'lucide-react';

const styles = {
  sidebar: {
    width: '280px',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    flexShrink: 0,
    background: 'var(--bg-sidebar)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 0 12px var(--primary-glow)',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '500',
    width: 'fit-content',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
  },
  statusDot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
  },
  navSection: {
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderBottom: '1px solid var(--border)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'var(--transition)',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  navItemActive: {
    color: 'var(--text-primary)',
    background: 'var(--bg-card-hover)',
    borderLeft: '3px solid var(--secondary)',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '2px',
  },
  uploadSection: {
    padding: '16px',
    borderBottom: '1px solid var(--border)',
  },
  dropZone: {
    border: '1px dashed var(--border-hover)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg-input)',
  },
  dropZoneActive: {
    borderColor: 'var(--primary)',
    background: 'var(--primary-glow)',
  },
  uploadTitle: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  uploadSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  progressContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  progressBarBg: {
    height: '3px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(to right, var(--primary), var(--secondary))',
    transition: 'width 0.2s ease',
  },
  progressText: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    justifyContent: 'space-between',
  },
  docListSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listHeader: {
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px 4px 8px',
  },
  docCard: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
  },
  docCardActive: {
    borderColor: 'var(--secondary)',
    background: 'rgba(0, 212, 255, 0.04)',
  },
  docIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  docInfo: {
    flex: 1,
    minWidth: 0,
  },
  docName: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '1px',
  },
  docMeta: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'var(--transition)',
    display: 'flex',
    opacity: 0,
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userPlan: {
    fontSize: '0.65rem',
    color: 'var(--secondary)',
    fontWeight: '500',
  }
};

export function Sidebar({ 
  documents, 
  activeDocId, 
  onSelectDoc, 
  onUploadDoc, 
  onDeleteDoc, 
  isOffline,
  activeTab,
  setActiveTab,
  user
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const processUpload = async (file) => {
    const validExtensions = ['.txt', '.md', '.json', '.pdf', '.docx', '.csv'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Unsupported file format. Please upload .txt, .md, .json, .csv, .pdf or .docx');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await onUploadDoc(file, (progress) => {
        setUploadProgress(progress);
      });
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div style={styles.sidebar}>
      {/* Sidebar Header */}
      <div style={styles.header}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>D</div>
          <div style={styles.logoText}>DocAI</div>
        </div>
        
        {/* Connection status badge */}
        <div 
          style={{ 
            ...styles.statusBadge, 
            color: isOffline ? 'var(--warning)' : 'var(--success)'
          }}
        >
          <div 
            style={{ 
              ...styles.statusDot, 
              backgroundColor: isOffline ? 'var(--warning)' : 'var(--success)',
              animation: isOffline ? 'none' : 'indexPulse 1.5s infinite' 
            }} 
          />
          <span style={{ fontSize: '0.65rem' }}>{isOffline ? 'Standalone Mode' : 'Connected'}</span>
        </div>
      </div>

      {/* Navigation Tab list */}
      <div style={styles.navSection}>
        <button 
          style={{ ...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {}) }}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>
        
        <button 
          style={{ ...styles.navItem, ...(activeTab === 'chat' && activeDocId ? styles.navItemActive : {}) }}
          onClick={() => {
            if (activeDocId) {
              setActiveTab('chat');
            } else {
              alert('Please select or upload a document first to enter Chat view.');
            }
          }}
        >
          <History size={16} />
          <span>AI Chat Q&A</span>
        </button>

      </div>

      {/* Upload Box */}
      <div style={styles.uploadSection}>
        <input 
          ref={fileInputRef}
          type="file" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".txt,.md,.json,.csv,.pdf,.docx"
        />
        
        <div 
          style={{ 
            ...styles.dropZone, 
            ...(isDragActive ? styles.dropZoneActive : {}) 
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
        >
          <UploadCloud size={20} color="var(--text-secondary)" />
          <div>
            <div style={styles.uploadTitle}>Upload Document</div>
            <div style={styles.uploadSub}>Drag & drop or click</div>
          </div>
        </div>

        {/* Upload progress */}
        {isUploading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressText}>
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Documents selector List */}
      <div style={styles.docListSection}>
        <div style={styles.listHeader}>
          <span>Documents</span>
          <span>{documents.length}</span>
        </div>

        {documents.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-muted)', gap: '6px' }}>
            <FileText size={16} style={{ opacity: 0.5 }} />
            <span style={{ fontSize: '0.7rem' }}>No documents uploaded</span>
          </div>
        ) : (
          documents.map(doc => {
            const isActive = doc.id === activeDocId;
            return (
              <div 
                key={doc.id}
                style={{
                  ...styles.docCard,
                  ...(isActive ? styles.docCardActive : {})
                }}
                onClick={() => onSelectDoc(doc.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.12)';
                  const btn = e.currentTarget.querySelector('.delete-doc-btn');
                  if (btn) btn.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.05)';
                  const btn = e.currentTarget.querySelector('.delete-doc-btn');
                  if (btn) btn.style.opacity = '0';
                }}
              >
                <div style={styles.docIcon}>
                  <FileText size={13} />
                </div>
                <div style={styles.docInfo}>
                  <div style={styles.docName} title={doc.name}>{doc.name}</div>
                  <div style={styles.docMeta}>
                    <span>{formatSize(doc.size)}</span>
                  </div>
                </div>
                <button 
                  className="delete-doc-btn"
                  style={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDoc(doc.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar User Profile Footer */}
      <div style={styles.footer}>
        <img 
          src={user?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
          alt="User Avatar" 
          style={styles.userAvatar} 
        />
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.name || "Sarah Jenkins"}</span>
          <span style={styles.userPlan}>{user?.email || "Pro Enterprise"}</span>
        </div>
      </div>
    </div>
  );
}
