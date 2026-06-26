import React, { useState, useEffect, useRef } from 'react';
import { Search, EyeOff, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--bg-sidebar)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRight: '1px solid var(--border)',
    minWidth: 0,
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    background: 'var(--bg-topnav)',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  title: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    width: '240px',
    transition: 'var(--transition)',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8125rem',
    outline: 'none',
    width: '100%',
  },
  contentArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  paragraph: {
    fontSize: '0.9375rem',
    lineHeight: '1.65',
    color: 'var(--text-secondary)',
    padding: '8px 12px',
    borderRadius: '6px',
    borderLeft: '3px solid transparent',
    transition: 'all 0.4s ease',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    gap: '12px',
    padding: '40px',
  },
  emptyTitle: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  emptyText: {
    fontSize: '0.8125rem',
    textAlign: 'center',
    maxWidth: '280px',
  },
  highlight: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    color: 'var(--text-primary)',
    borderRadius: '2px',
    padding: '0 2px',
  },
  citeIndex: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    backgroundColor: 'var(--border)',
    fontSize: '0.6875rem',
    color: 'var(--text-secondary)',
    marginRight: '8px',
    fontWeight: 'bold',
  }
};

export function DocumentViewer({ activeDoc, highlightedParagraphIndex, clearHighlight }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeHighlightIdx, setActiveHighlightIdx] = useState(null);
  const paragraphRefs = useRef({});
  const contentAreaRef = useRef(null);

  // Sync scroll to highlighted paragraph
  useEffect(() => {
    if (highlightedParagraphIndex !== null && highlightedParagraphIndex !== undefined) {
      const el = paragraphRefs.current[highlightedParagraphIndex];
      const container = contentAreaRef.current;
      if (container && el) {
        // Scroll the container directly to center the paragraph
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        const scrollPosition = container.scrollTop + (elTop - containerTop) - (container.clientHeight / 2) + (el.clientHeight / 2);
        
        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
        
        // Highlight active paragraph temporarily
        setActiveHighlightIdx(highlightedParagraphIndex);

        // Clear highlight selection state in parent after transition completes
        const timer = setTimeout(() => {
          setActiveHighlightIdx(null);
          if (clearHighlight) clearHighlight();
        }, 3000); // 3 seconds glow

        return () => clearTimeout(timer);
      }
    }
  }, [highlightedParagraphIndex, clearHighlight]);

  const highlightText = (text) => {
    if (!searchTerm.trim()) return text;
    
    try {
      const regex = new RegExp(`(${searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} style={styles.highlight}>{part}</mark>
        ) : part
      );
    } catch (e) {
      return text;
    }
  };

  const getParagraphStyle = (idx) => {
    if (activeHighlightIdx === idx) {
      return {
        ...styles.paragraph,
        backgroundColor: 'var(--primary-glow)',
        borderColor: 'var(--primary)',
        color: 'var(--text-primary)',
        boxShadow: '0 0 16px 0 var(--primary-glow)',
      };
    }
    return styles.paragraph;
  };

  return (
    <div style={styles.container}>
      {activeDoc ? (
        <>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.titleGroup}>
              <FileText size={18} color="var(--primary)" />
              <div style={styles.title} title={activeDoc.name}>{activeDoc.name}</div>
            </div>
            
            {/* Search */}
            <div 
              style={styles.searchBar}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Search size={14} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search in document..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Content Area */}
          <div ref={contentAreaRef} style={styles.contentArea}>
            {activeDoc.paragraphs && activeDoc.paragraphs.length > 0 ? (
              activeDoc.paragraphs.map((pText, idx) => (
                <div 
                  key={idx}
                  ref={el => paragraphRefs.current[idx] = el}
                  style={getParagraphStyle(idx)}
                >
                  <span style={styles.citeIndex}>{idx + 1}</span>
                  {highlightText(pText)}
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {highlightText(activeDoc.content)}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={styles.emptyState}>
          <EyeOff size={40} />
          <div style={styles.emptyTitle}>No document selected</div>
          <div style={styles.emptyText}>
            Select a document from the sidebar or upload a new one to view its content and start Q&A.
          </div>
        </div>
      )}
    </div>
  );
}
