import React, { useRef, useState, useEffect } from 'react';
import { Send, Trash2, Download, Bot, User, Sparkles, AlertCircle, Mic } from 'lucide-react';

const styles = {
  container: {
    width: '500px',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--bg-sidebar)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-topnav)',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '0.9375rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  messageStream: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  welcomeScreen: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    justifyContent: 'center',
    padding: '20px',
  },
  welcomeHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  welcomeTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  welcomeText: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    maxWidth: '100%',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
  suggestionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  suggestionChip: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    fontSize: '0.8125rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  messageRow: {
    display: 'flex',
    gap: '12px',
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantRow: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  userAvatar: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  },
  assistantAvatar: {
    background: 'var(--primary-glow)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  userBubble: {
    background: 'var(--primary)',
    color: '#ffffff',
    borderBottomRightRadius: '2px',
  },
  assistantBubble: {
    background: 'none',
    color: 'var(--text-primary)',
    border: 'none',
    padding: '4px 0',
  },
  citationPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    border: '1px solid rgba(0, 212, 255, 0.25)',
    color: 'var(--secondary)',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    marginLeft: '6px',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0',
    background: 'none',
    border: 'none',
    alignSelf: 'flex-start',
    marginLeft: '42px',
  },
  typingDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--text-secondary)',
    animation: 'typing 1s infinite ease-in-out',
  },
  inputArea: {
    padding: '16px 20px 24px 20px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-main)',
  },
  inputWrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    position: 'relative',
    transition: 'var(--transition)',
  },
  textarea: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-body)',
    resize: 'none',
    height: '24px',
    minHeight: '24px',
    outline: 'none',
    maxHeight: '120px',
    padding: '2px 0',
    lineHeight: '1.4',
    overflowY: 'auto',
  },
  sendBtn: {
    background: 'var(--primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  sendBtnDisabled: {
    background: 'var(--bg-card)',
    color: 'var(--text-muted)',
    cursor: 'not-allowed',
  },
  micBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  warningBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--error)',
    fontSize: '0.75rem',
    marginBottom: '10px',
  }
};

function AssistantResponseCard({ content, citations, onCitationClick }) {
  const [showSources, setShowSources] = useState(false);

  const renderInlineContent = (text, cits = []) => {
    if (!text) return null;

    const boldRegex = /\*\*([^*]+)\*\*/g;
    const boldParts = text.split(boldRegex);

    return boldParts.flatMap((part, boldIdx) => {
      const isBold = boldIdx % 2 === 1;
      const citationRegex = /\[(\d+)\]/g;
      const citationParts = part.split(citationRegex);

      return citationParts.map((subPart, citIdx) => {
        const isCitation = citIdx % 2 === 1;

        if (isCitation) {
          const citationNumber = parseInt(subPart, 10);
          const citation = cits[citationNumber - 1];
          const targetIdx = citation ? citation.index : null;

          return (
            <span 
              key={`cit-${boldIdx}-${citIdx}`} 
              style={styles.citationPill}
              onClick={() => targetIdx !== null && onCitationClick(targetIdx)}
              title={citation ? citation.snippet : `View Paragraph ${citationNumber}`}
            >
              [{citationNumber}]
            </span>
          );
        }

        if (isBold) {
          return (
            <strong key={`bold-${boldIdx}-${citIdx}`} style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
              {subPart}
            </strong>
          );
        }
        return subPart;
      });
    });
  };

  // Custom AI Response Citations bracket matching e.g. [1], [2]
  const formatAiResponse = (text, cits = []) => {
    if (!text) return '';
    const lines = text.split('\n');
    const elements = [];
    let currentListItems = [];

    const flushList = (key) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} style={{ paddingLeft: '20px', margin: '8px 0', listStyleType: 'disc' }}>
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const contentStr = line.replace(/^\s*[\*\-]\s+/, '');
        currentListItems.push(
          <li 
            key={`li-${lineIdx}`} 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem', 
              lineHeight: '1.6', 
              marginBottom: '4px' 
            }}
          >
            {renderInlineContent(contentStr, cits)}
          </li>
        );
      } else if (/^\d+\.\s+/.test(trimmed)) {
        flushList(lineIdx);
        const contentStr = trimmed.replace(/^\d+\.\s+/, '');
        const matchNumber = trimmed.match(/^\d+\./)[0];
        elements.push(
          <div 
            key={`ol-li-${lineIdx}`} 
            style={{ 
              paddingLeft: '20px', 
              textIndent: '-20px', 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem', 
              lineHeight: '1.6', 
              margin: '6px 0' 
            }}
          >
            <strong>{matchNumber} </strong>
            {renderInlineContent(contentStr, cits)}
          </div>
        );
      } else if (trimmed === '' || trimmed === '.') {
        flushList(lineIdx);
        if (trimmed === '') {
          elements.push(<div key={`space-${lineIdx}`} style={{ height: '8px' }} />);
        }
      } else {
        flushList(lineIdx);
        elements.push(
          <p 
            key={`p-${lineIdx}`} 
            style={{ 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem', 
              lineHeight: '1.6', 
              margin: '8px 0',
              wordBreak: 'break-word'
            }}
          >
            {renderInlineContent(trimmed, cits)}
          </p>
        );
      }
    });

    flushList('end');
    return elements;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>{formatAiResponse(content, citations)}</div>
      
      {citations && citations.length > 0 && (
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '0.75rem' }}>
            <button 
              onClick={() => setShowSources(!showSources)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
            >
              {showSources ? 'Hide Sources' : `Show Sources (${citations.length})`}
            </button>
          </div>
          
          {showSources && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {citations.map((cit, idx) => (
                <div 
                  key={idx} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => onCitationClick(cit.index)}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '3px', fontSize: '0.65rem' }}>
                    <span>Citation #{idx + 1}</span>
                    <span>Paragraph {cit.index + 1}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    "{cit.snippet}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatPanel({ 
  messages, 
  activeDoc, 
  isGenerating, 
  onSendMessage, 
  onClearHistory, 
  onCitationClick 
}) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messageStreamRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messageStreamRef.current) {
      messageStreamRef.current.scrollTo({
        top: messageStreamRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isGenerating]);

  // Handle grow textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || !activeDoc || isGenerating) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
    }
  };

  const selectSuggestion = (question) => {
    if (!activeDoc || isGenerating) return;
    onSendMessage(question);
  };

  const exportHistory = () => {
    if (messages.length === 0) return;
    
    let content = `Document Q&A Chat Session\n`;
    content += `Document: ${activeDoc?.name || 'None'}\n`;
    content += `Export Date: ${new Date().toLocaleString()}\n`;
    content += `=========================================\n\n`;

    messages.forEach((msg) => {
      const roleName = msg.role === 'user' ? 'USER' : 'AI ASSISTANT';
      content += `[${roleName}] (${new Date(msg.timestamp).toLocaleTimeString()})\n`;
      content += `${msg.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chat_History_${activeDoc?.name || 'session'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSuggestions = () => {
    return [
      "Can you summarize this document?",
      "What are the main key takeaways here?",
      "Can you explain the core concepts in this text?",
    ];
  };

  const handleVoiceQuery = () => {
    setIsListening(true);
    // Simulate Siri-style transcription
    setTimeout(() => {
      setInputValue("Can you summarize this document?");
      setIsListening(false);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <div className="ai-orb" style={{ width: '22px', height: '22px', boxShadow: '0 0 8px #7B61FF' }} />
          <div style={styles.title}>AI BOT</div>
        </div>
        <div style={styles.actionsGroup}>
          {messages.length > 0 && (
            <>
              <button 
                style={styles.sendBtn} 
                className="btn-icon" 
                onClick={exportHistory}
                title="Export History"
              >
                <Download size={13} />
              </button>
              <button 
                style={styles.sendBtn} 
                className="btn-icon" 
                onClick={onClearHistory}
                title="Clear Chat"
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stream messages */}
      <div ref={messageStreamRef} style={styles.messageStream}>
        {!activeDoc ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '12px', textAlign: 'center', padding: '20px' }}>
            <div className="ai-orb" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <span style={{ fontSize: '0.85rem' }}>Select a document to begin chatting</span>
          </div>
        ) : messages.length === 0 ? (
          /* Welcome screen siri orb */
          <div style={styles.welcomeScreen} className="animate-fade-in">
            <div style={styles.welcomeHeader}>
              <div className="ai-orb" style={{ marginBottom: '16px' }} />
              <div style={styles.welcomeTitle}>Ask DocAI BOT</div>
              <div style={styles.welcomeText}>
                I can summarize, query context, or answer specific questions about **{activeDoc.name}**.
              </div>
            </div>

            <div style={styles.suggestionsList}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Suggested Questions:</div>
              {getSuggestions().map((q, idx) => (
                <button 
                  key={idx} 
                  style={styles.suggestionChip}
                  onClick={() => selectSuggestion(q)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(108, 99, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <Sparkles size={12} color="var(--primary)" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const timeString = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              
              return (
                <div 
                  key={idx} 
                  style={{
                    ...styles.messageRow,
                    ...(isUser ? styles.userRow : styles.assistantRow),
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                  className="animate-fade-in"
                >
                  <div style={{ display: 'flex', gap: '10px', width: '100%', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                    <div style={{
                      ...styles.avatar,
                      ...(isUser ? styles.userAvatar : styles.assistantAvatar)
                    }}>
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </div>
                    
                    {isUser ? (
                      <div style={{ ...styles.bubble, ...styles.userBubble }}>
                        {msg.content}
                      </div>
                    ) : (
                      <div style={{ ...styles.bubble, ...styles.assistantBubble, flex: 1, minWidth: 0 }}>
                        <AssistantResponseCard 
                          content={msg.content} 
                          citations={msg.citations} 
                          onCitationClick={onCitationClick}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-muted)', 
                    marginTop: '3px', 
                    alignSelf: isUser ? 'flex-end' : 'flex-start', 
                    paddingLeft: isUser ? '0' : '40px', 
                    paddingRight: isUser ? '40px' : '0' 
                  }}>
                    {timeString}
                  </span>
                </div>
              );
            })}
            
            {/* Typing Loader */}
            {isGenerating && (
              <div style={styles.typingIndicator}>
                <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
              </div>
            )}
            
          </>
        )}
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        {!activeDoc && (
          <div style={styles.warningBanner}>
            <AlertCircle size={14} />
            <span>Select or upload a document to enable chatting</span>
          </div>
        )}
        
        <div 
          style={{
            ...styles.inputWrapper,
            borderColor: activeDoc ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'
          }}
        >
          {/* Voice query button */}
          <button 
            style={{
              ...styles.micBtn,
              color: isListening ? '#00D4FF' : 'var(--text-secondary)'
            }} 
            disabled={!activeDoc}
            onClick={handleVoiceQuery}
            title="Voice query (Simulated Transcription)"
          >
            <Mic size={15} style={{ animation: isListening ? 'orbPulse 1s infinite alternate' : 'none' }} />
          </button>

          <textarea 
            ref={textareaRef}
            rows={1}
            placeholder={activeDoc ? "Ask a question about this document..." : "Select a document to begin..."}
            style={styles.textarea}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!activeDoc || isGenerating}
          />
          <button 
            style={{
              ...styles.sendBtn,
              ...(inputValue.trim() && activeDoc && !isGenerating ? {} : styles.sendBtnDisabled)
            }}
            disabled={!inputValue.trim() || !activeDoc || isGenerating}
            onClick={handleSubmit}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
