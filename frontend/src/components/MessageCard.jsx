import React from 'react';

const MessageCard = ({ message, isMe, senderName }) => {
  return (
    <div style={{
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      maxWidth: '80%',
      background: isMe ? 'var(--primary-glow)' : 'var(--bg-tertiary)',
      border: isMe ? '1px solid rgba(255, 107, 107, 0.2)' : '1px solid var(--border-color)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      borderBottomRightRadius: isMe ? '0' : 'var(--radius-md)',
      borderBottomLeftRadius: isMe ? 'var(--radius-md)' : '0'
    }}>
      <span style={{ fontSize: '0.75rem', color: isMe ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
        {isMe ? 'You' : senderName}
      </span>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word', margin: 0 }}>{message.text}</p>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageCard;
