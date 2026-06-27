import React, { useEffect, useState } from 'react';
import { Sparkles, FileText, Lock, MessageSquare, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-primary)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowY: 'auto',
    fontFamily: 'var(--font-body)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 0 15px var(--primary-glow)',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '20px',
    background: 'var(--primary-glow)',
    border: '1px solid var(--primary)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '24px',
  },
  tabContainer: {
    display: 'flex',
    width: '100%',
    borderBottom: '1px solid var(--border)',
    marginBottom: '8px',
  },
  tabBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
    outline: 'none',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    fontSize: '0.8rem',
    width: '100%',
    textAlign: 'left',
  },
  authTitle: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnContainer: {
    width: '100%',
    minHeight: '44px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '8px 0',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border)',
  },
  dividerText: {
    padding: '0 12px',
  },
  demoForm: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
    transition: 'var(--transition)',
  },
  demoBtn: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
    color: '#ffffff',
    padding: '12px 18px',
    fontSize: '0.875rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(123, 97, 255, 0.25)',
  },
  featureCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: 'var(--radius-lg)',
  },
  featureIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'var(--primary-glow)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  featureDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  themeToggleBtn: {
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
    transition: 'var(--transition)',
  }
};

export function HomePage({ onLoginSuccess, theme, toggleTheme, Sun, Moon }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userData;
      if (activeTab === 'login') {
        userData = await apiService.login(email.trim(), password);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        userData = await apiService.signup(email.trim(), password, name.trim());
      }
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let checkInterval;
    
    const initGoogle = () => {
      /* global google */
      if (typeof google !== 'undefined') {
        try {
          google.accounts.id.initialize({
            client_id: "771444376879-uatraojii83arpb1pgsciibpkomtu5no.apps.googleusercontent.com",
            callback: async (response) => {
              setError('');
              setLoading(true);
              try {
                const userData = await apiService.loginWithGoogle(response.credential);
                onLoginSuccess(userData);
              } catch (err) {
                setError(err.message || 'Google authentication failed');
              } finally {
                setLoading(false);
              }
            }
          });
          
          const btnParent = document.getElementById("google-signin-btn");
          let buttonWidth = 336;
          if (btnParent && btnParent.parentElement) {
            const parentStyle = window.getComputedStyle(btnParent.parentElement);
            const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(parentStyle.paddingRight) || 0;
            const contentWidth = btnParent.parentElement.clientWidth - paddingLeft - paddingRight;
            if (contentWidth > 0) {
              buttonWidth = Math.min(336, Math.max(200, contentWidth));
            }
          }

          google.accounts.id.renderButton(
            btnParent,
            { 
              theme: theme === 'dark' ? "filled_black" : "outline", 
              size: "large", 
              width: buttonWidth,
              text: activeTab === 'login' ? 'signin_with' : 'signup_with'
            }
          );
          
          if (checkInterval) clearInterval(checkInterval);
        } catch (err) {
          console.error('Failed to initialize Google Sign-in:', err);
        }
      }
    };

    initGoogle();
    
    // Polling fallback in case script is still loading
    if (typeof google === 'undefined') {
      checkInterval = setInterval(initGoogle, 500);
    }
    
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [theme, activeTab, onLoginSuccess, windowWidth]);

  return (
    <div style={styles.container}>
      {/* Background Blobs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '10%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(100px)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '15%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(110px)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header className="homepage-header">
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>D</div>
          <div style={styles.logoText}>DocAI</div>
        </div>
        <button style={styles.themeToggleBtn} onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div style={styles.heroBadge}>
          <Sparkles size={13} color="var(--secondary)" />
          <span>Intelligent Document Workspace</span>
        </div>
        <h1 className="hero-title">Chat with Your Documents Instantly</h1>
        <p className="hero-subtitle">
          Upload PDFs, DOCX, or text files and query them with AI. 
          Get instant summaries, context-aware answers, and direct page references.
        </p>

        {/* Login Card */}
        <div className="glass-card auth-card" style={{ gap: '20px', padding: '36px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>Welcome to DocAI</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sign in with Google to enter your workspace</p>
          </div>

          {error && (
            <div style={styles.errorText}>
              ⚠️ {error}
            </div>
          )}

          <div id="google-signin-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0' }} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <div className="glass-card" style={styles.featureCard}>
          <div style={styles.featureIconWrapper}>
            <MessageSquare size={18} />
          </div>
          <div style={styles.featureTitle}>Conversational Q&A</div>
          <div style={styles.featureDesc}>
            Query your files in natural language and get precise answers derived directly from the content.
          </div>
        </div>

        <div className="glass-card" style={styles.featureCard}>
          <div style={styles.featureIconWrapper}>
            <Sparkles size={18} />
          </div>
          <div style={styles.featureTitle}>Dynamic Citations</div>
          <div style={styles.featureDesc}>
            Verify AI answers with built-in reference links that jump directly to the exact source paragraphs.
          </div>
        </div>

        <div className="glass-card" style={styles.featureCard}>
          <div style={styles.featureIconWrapper}>
            <FileText size={18} />
          </div>
          <div style={styles.featureTitle}>Multi-format Parsing</div>
          <div style={styles.featureDesc}>
            Upload text files, PDF documents, or Word documents. AI parses the semantic layout automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
