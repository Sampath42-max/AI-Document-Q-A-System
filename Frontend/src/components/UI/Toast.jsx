import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const toastStyles = {
  container: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '280px',
    maxWidth: '420px',
    color: '#ffffff',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.15)',
    backdropFilter: 'blur(12px)',
    borderLeft: '4px solid var(--success)',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.15)',
    backdropFilter: 'blur(12px)',
    borderLeft: '4px solid var(--error)',
  },
  info: {
    background: 'rgba(59, 130, 246, 0.15)',
    backdropFilter: 'blur(12px)',
    borderLeft: '4px solid var(--info)',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
  },
  message: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    padding: '2px',
    borderRadius: '4px',
    transition: 'var(--transition)',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    background: 'currentColor',
    opacity: 0.6,
  }
};

export function Toast({ id, message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--success)" />;
      case 'error':
        return <AlertTriangle size={18} color="var(--error)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--info)" />;
    }
  };

  const getTypeStyle = () => {
    switch (type) {
      case 'success':
        return toastStyles.success;
      case 'error':
        return toastStyles.error;
      case 'info':
      default:
        return toastStyles.info;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'info':
      default: return 'Notification';
    }
  };

  return (
    <div 
      style={{ ...toastStyles.container, ...getTypeStyle() }}
      className="glass-panel"
      role="alert"
    >
      {getIcon()}
      <div style={toastStyles.textContainer}>
        <div style={{ ...toastStyles.title, color: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)' }}>
          {getTitle()}
        </div>
        <div style={toastStyles.message}>{message}</div>
      </div>
      <button 
        style={toastStyles.closeBtn} 
        onClick={() => onClose(id)}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
      
      {duration !== Infinity && (
        <div 
          style={{
            ...toastStyles.progressBar,
            color: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)',
            animation: `shrinkWidth ${duration}ms linear forwards`
          }} 
        />
      )}

      {/* Embedded local styling for custom anim inside react */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
}

// Simple export of ToastContainer wrapper style
export const toastContainerStyle = {
  position: 'fixed',
  top: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 9999,
};
