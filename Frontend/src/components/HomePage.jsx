import React, { useEffect, useState } from 'react';
import { Sparkles, FileText, Lock, MessageSquare, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-primary)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowY: 'auto',
    fontFamily: 'var(--font-body)',
  },
  header: {
    height: '80px',
    padding: '0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-topnav)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 24px 60px 24px',
    textAlign: 'center',
    flex: 1,
    zIndex: 2,
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
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    maxWidth: '850px',
    marginBottom: '20px',
    fontFamily: 'var(--font-heading)',
    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  authCard: {
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    borderRadius: 'var(--radius-xl)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
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
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    padding: '60px 40px 100px 40px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    zIndex: 2,
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
          
          google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { 
              theme: theme === 'dark' ? "filled_black" : "outline", 
              size: "large", 
              width: 336,
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
  }, [theme, activeTab, onLoginSuccess]);

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
      <header style={styles.header}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>D</div>
          <div style={styles.logoText}>DocAI</div>
        </div>
        <button style={styles.themeToggleBtn} onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <Sparkles size={13} color="var(--secondary)" />
          <span>Intelligent Document Workspace</span>
        </div>
        <h1 style={styles.title}>Chat with Your Documents Instantly</h1>
        <p style={styles.subtitle}>
          Upload PDFs, DOCX, or text files and query them with AI. 
          Get instant summaries, context-aware answers, and direct page references.
        </p>

        {/* Login Card */}
        <div className="glass-card" style={styles.authCard}>
          <div style={styles.tabContainer}>
            <button 
              type="button"
              style={{
                ...styles.tabBtn,
                color: activeTab === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              }}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Log In
            </button>
            <button 
              type="button"
              style={{
                ...styles.tabBtn,
                color: activeTab === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'signup' ? '2px solid var(--primary)' : '2px solid transparent',
              }}
              onClick={() => { setActiveTab('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={styles.errorText}>
              ⚠️ {error}
            </div>
          )}

          <form style={styles.demoForm} onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button type="submit" style={styles.demoBtn} disabled={loading}>
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Enter Workspace' : 'Create Account'}</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <div id="google-signin-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
        </div>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresSection}>
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
