'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: UploadedFile[];
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded data
}

interface ChatInterfaceProps {
  childAge: number;
  initialQuestion?: string;
  onQuestionProcessed?: () => void;
}

export default function ChatInterface({ childAge, initialQuestion, onQuestionProcessed }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: childAge <= 10 
        ? "Hi there! 🌟 I'm your learning buddy! I love helping kids discover answers by asking fun questions. What are you working on today? You can tell me about your homework or even share a picture of it!"
        : childAge <= 13
        ? "Hello! I'm here to help you think through your homework step by step. What subject are you working on today? Feel free to share your question or upload any materials you need help with."
        : "Hi! I'm your educational assistant. I'll guide you through problem-solving using questions that help you think critically. What assignment or concept would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedQuestionRef = useRef<string>('');

  // Handle initial question from examples
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() && initialQuestion !== processedQuestionRef.current) {
      processedQuestionRef.current = initialQuestion;
      // Clear the chat first for a fresh start
      const newMessages = [{
        id: '1',
        role: 'assistant' as const,
        content: childAge <= 10 
          ? "Hi there! 🌟 I'm your learning buddy! I love helping kids discover answers by asking fun questions. What are you working on today? You can tell me about your homework or even share a picture of it!"
          : childAge <= 13
          ? "Hello! I'm here to help you think through your homework step by step. What subject are you working on today? Feel free to share your question or upload any materials you need help with."
          : "Hi! I'm your educational assistant. I'll guide you through problem-solving using questions that help you think critically. What assignment or concept would you like to explore today?",
        timestamp: new Date()
      }];
      
      setMessages(newMessages);
      
      // Process the example question immediately with the fresh chat state
      setTimeout(() => {
        // Create the user message
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: initialQuestion,
          timestamp: new Date()
        };

        // Build conversation history with just the initial assistant message
        const conversationHistory = [
          { role: newMessages[0].role, content: newMessages[0].content },
          { role: userMessage.role, content: userMessage.content }
        ];

        // Add user message to state
        setMessages(prev => [...prev, userMessage]);
        
        // Send to API
        setIsLoading(true);
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationHistory: conversationHistory,
            files: [],
            childAge
          })
        })
        .then(async response => {
          if (response.ok) {
            const data = await response.json();
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: data.response,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
          } else {
            throw new Error('Failed to get response');
          }
        })
        .catch(error => {
          console.error('Error sending message:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'm having trouble connecting right now. Can you tell me more about what you're working on? I'd love to help you think through it!",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        })
        .finally(() => {
          setIsLoading(false);
        });
      }, 50);
      
      // Clear the initial question
      if (onQuestionProcessed) {
        onQuestionProcessed();
      }
    } else if (!initialQuestion || !initialQuestion.trim()) {
      // Reset the processed question ref when there's no question
      processedQuestionRef.current = '';
    }
  }, [initialQuestion, childAge, onQuestionProcessed]);

  const processMessage = async (message: string, files: UploadedFile[]) => {
    setIsLoading(true);

    // Create the user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message || (files.length > 0 ? `Uploaded ${files.length} file(s)` : ''),
      files: files.length > 0 ? [...files] : undefined,
      timestamp: new Date()
    };

    try {
      // Build the conversation history including the new user message
      // Use current messages plus the new message for the API call
      const conversationHistory = [
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: userMessage.role, content: userMessage.content }
      ];

      // Add user message to state AFTER building conversation history
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: conversationHistory,
          files: files,
          childAge
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Can you tell me more about what you're working on? I'd love to help you think through it!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const validFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type and size
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          try {
            const base64 = await fileToBase64(file);
            validFiles.push({
              name: file.name,
              size: file.size,
              type: file.type,
              data: base64
            });
          } catch (error) {
            console.error('Error processing file:', error);
          }
        } else {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
      } else {
        alert(`File ${file.name} is not supported. Please upload PDF or image files only.`);
      }
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 data
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    if (isLoading) return;

    const messageToSend = inputMessage;
    const filesToSend = [...uploadedFiles];
    
    setInputMessage('');
    setUploadedFiles([]);
    
    await processMessage(messageToSend, filesToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: childAge <= 10 
        ? "Hi there! 🌟 I'm your learning buddy! I love helping kids discover answers by asking fun questions. What are you working on today? You can tell me about your homework or even share a picture of it!"
        : childAge <= 13
        ? "Hello! I'm here to help you think through your homework step by step. What subject are you working on today? Feel free to share your question or upload any materials you need help with."
        : "Hi! I'm your educational assistant. I'll guide you through problem-solving using questions that help you think critically. What assignment or concept would you like to explore today?",
      timestamp: new Date()
    }]);
  };

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
          Learning Chat
        </h1>
        <p style={{ color: '#6b7280' }}>
          Ask questions, share homework, and discover answers together!
        </p>
      </div>

      <div className="scout-chat-container">
        <div className="scout-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Chat Session</span>
            <button onClick={clearChat} className="scout-btn-outline">
              New Conversation
            </button>
          </div>
        </div>

        <div className="scout-chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`scout-message ${message.role}`}>
              {message.role === 'assistant' && <div className="scout-message-avatar">🤖</div>}
              <div className="scout-message-content">
                <div className="scout-message-text">{message.content}</div>
                {message.files && message.files.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {message.files.map((file, index) => (
                      <div key={index} style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        background: '#f3f4f6',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span>{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                        <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({formatFileSize(file.size)})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {message.role === 'user' && <div className="scout-message-avatar">👤</div>}
            </div>
          ))}
          
          {isLoading && (
            <div className="scout-message assistant">
              <div className="scout-message-avatar">🤖</div>
              <div className="scout-message-content">
                <div className="scout-thinking">Thinking...</div>
              </div>
            </div>
          )}
        </div>

        <div 
          className={`scout-chat-input-container ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFiles.length > 0 && (
            <div style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
              {uploadedFiles.map((file, index) => (
                <div key={index} style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: '#f3f4f6',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  marginRight: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span>{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                  <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(index)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '6px'
              }}
              title="Upload files"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question or describe your homework..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                resize: 'none',
                minHeight: '44px',
                maxHeight: '120px',
                fontFamily: 'inherit'
              }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
              className="scout-btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        💡 Upload PDF documents or images by clicking the 📎 button or dragging files here!
      </div>
    </div>
  );
} 