'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [submissions, setSubmissions] = useState({
    contacts: [],
    inquiries: [],
    newsletters: []
  });
  const [analytics, setAnalytics] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  
  // AI Assistant state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. Ask me anything about your portfolio, analytics, or how to manage your submissions.' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check');
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAdminData();
      }
      setBackendStatus('connected');
    } catch (error) {
      console.error('Auth check failed:', error);
      setBackendStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const submissionsRes = await fetch('/api/admin/submissions');
      const submissionsData = await submissionsRes.json();
      if (submissionsData.success && submissionsData.data) {
        setSubmissions({
          contacts: submissionsData.data.contacts || [],
          inquiries: submissionsData.data.inquiries || [],
          newsletters: submissionsData.data.newsletters || []
        });
      }
      
      const analyticsRes = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginStatus('Logging in...');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        setLoginStatus('Login successful!');
        loadAdminData();
      } else {
        setLoginStatus(result.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoginStatus('Connection error. Backend may be offline.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {}
    setIsAuthenticated(false);
    setSubmissions({ contacts: [], inquiries: [], newsletters: [] });
    setAnalytics(null);
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setDeleting(`${type}-${id}`);
    
    try {
      const response = await fetch(`/api/admin/submission/${type}/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        loadAdminData();
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Deleted successfully', 'success');
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiLoading(true);

    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    const response = generateAIResponse(userMessage);
    
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setAiLoading(false);
    }, 1000);
  };

  const generateAIResponse = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('analytics') || q.includes('stats') || q.includes('views')) {
      const views = analytics?.stats?.totalPageViews || 0;
      const projects = analytics?.stats?.totalProjectViews || 0;
      const downloads = analytics?.stats?.totalResumeDownloads || 0;
      return `Here are your current analytics:\n\n- Total Page Views: ${views}\n- Project Views: ${projects}\n- Resume Downloads: ${downloads}`;
    }
    
    if (q.includes('contact') || q.includes('message') || q.includes('inquiry')) {
      const contacts = submissions.contacts?.length || 0;
      const inquiries = submissions.inquiries?.length || 0;
      return `You have ${contacts} contact messages and ${inquiries} service inquiries.`;
    }
    
    if (q.includes('newsletter') || q.includes('subscriber')) {
      const subs = submissions.newsletters?.length || 0;
      return `You have ${subs} newsletter subscribers.`;
    }
    
    if (q.includes('help')) {
      return `I can help you with:\n\n- Analytics and stats\n- Contact submissions\n- Newsletter management\n- Deleting records\n\nWhat would you like to know?`;
    }
    
    return `I am here to help! Try asking about analytics, messages, or subscribers.`;
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <header className="site-header">
          <div className="container nav-wrap">
            <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          </div>
        </header>
        <main className="container section">
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link href="/" className="brand">Ashutosh<span className="brand-dot">.</span>Ranjan</Link>
          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`} id="mainNav">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              <span id="themeTrack" className={isDark ? 'on' : ''}>
                <span className="toggle-icon sun" aria-hidden="true">☀</span>
                <span className="toggle-icon moon" aria-hidden="true">☾</span>
                <span id="themeThumb" className={isDark ? 'on' : ''}></span>
              </span>
            </button>
            <button 
              className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle Menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <main className="container section">
        {!isAuthenticated ? (
          <div className="fade-up">
            <div className="page-title">
              <p className="eyebrow">Admin Access</p>
              <h1>Sign in to manage your portfolio</h1>
            </div>

            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '2rem',
              fontSize: '14px',
              fontWeight: '600',
              background: backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: backendStatus === 'connected' ? 'var(--success)' : 'var(--error)',
              border: `1px solid ${backendStatus === 'connected' ? 'var(--success)' : 'var(--error)'}`
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
              {backendStatus === 'connected' ? 'Backend Connected' : 'Backend Offline'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
              <form className="card glass-card" onSubmit={handleLogin} style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔑</div>
                  <h2 style={{ margin: 0 }}>Admin Login</h2>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required 
                    placeholder="Enter admin email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required 
                    placeholder="Enter admin password"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoggingIn}
                  style={{ width: '100%', padding: '14px' }}
                >
                  {isLoggingIn ? 'Logging in...' : 'Sign In'}
                </button>
                {loginStatus && (
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '1rem', 
                    fontWeight: '500',
                    color: loginStatus.includes('successful') ? 'var(--success)' : 'var(--error)'
                  }}>
                    {loginStatus}
                  </p>
                )}
              </form>

              <div className="card glass-card" style={{ padding: '1.5rem' }}>
                <h3>Secure Admin Panel</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                  <li style={{ padding: '0.5rem 0' }}>🔐 Only authorized users can access</li>
                  <li style={{ padding: '0.5rem 0' }}>📬 Contact submissions management</li>
                  <li style={{ padding: '0.5rem 0' }}>📊 Website analytics</li>
                  <li style={{ padding: '0.5rem 0' }}>👥 Newsletter subscribers</li>
                  <li style={{ padding: '0.5rem 0' }}>🤖 AI Assistant</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p className="eyebrow">Admin Dashboard</p>
                <h1>Manage Your Submissions</h1>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => setAiAssistantOpen(true)}>
                  🤖 AI Assistant
                </button>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '16px',
              marginBottom: '2rem' 
            }}>
              <div className="card glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.75rem' }}>📬</div>
                <div>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{submissions.contacts?.length || 0}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Contact Messages</div>
                </div>
              </div>
              <div className="card glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.75rem' }}>📧</div>
                <div>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{submissions.inquiries?.length || 0}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Service Inquiries</div>
                </div>
              </div>
              <div className="card glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.75rem' }}>👥</div>
                <div>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{submissions.newsletters?.length || 0}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Newsletter Subs</div>
                </div>
              </div>
              <div className="card glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.75rem' }}>📊</div>
                <div>
                  <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{analytics?.stats?.totalPageViews || 0}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Page Views</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--stroke)', paddingBottom: '1rem', overflowX: 'auto' }}>
              <button 
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'submissions' ? 'var(--primary)' : 'var(--surface)',
                  border: '1px solid var(--stroke)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: activeTab === 'submissions' ? 'white' : 'var(--muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setActiveTab('submissions')}
              >
                📬 Submissions
              </button>
              <button 
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'analytics' ? 'var(--primary)' : 'var(--surface)',
                  border: '1px solid var(--stroke)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: activeTab === 'analytics' ? 'white' : 'var(--muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics
              </button>
              <button 
                style={{
                  padding: '10px 20px',
                  background: activeTab === 'newsletter' ? 'var(--primary)' : 'var(--surface)',
                  border: '1px solid var(--stroke)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: activeTab === 'newsletter' ? 'white' : 'var(--muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => setActiveTab('newsletter')}
              >
                👥 Newsletter
              </button>
            </div>

            {activeTab === 'submissions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
                <div className="card glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--stroke)' }}>
                    <h3>Contact Messages</h3>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>{submissions.contacts?.length || 0}</span>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {submissions.contacts && submissions.contacts.length > 0 ? (
                      submissions.contacts.map((contact, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '1px solid var(--stroke)' }}>
                          <div style={{ flex: 1 }}>
                            <strong>{contact.name}</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', marginLeft: '8px' }}>{contact.email}</span>
                            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>{contact.projectType || 'N/A'} | {contact.budget || 'N/A'}</div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0' }}>{contact.message}</p>
                            <small style={{ color: 'var(--muted)' }}>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}</small>
                          </div>
                          <button 
                            style={{ background: 'none', border: '1px solid var(--stroke)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                            onClick={() => handleDelete('contact', contact._id)}
                            disabled={deleting === `contact-${contact._id}`}
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No messages yet</p>
                    )}
                  </div>
                </div>

                <div className="card glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--stroke)' }}>
                    <h3>Service Inquiries</h3>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>{submissions.inquiries?.length || 0}</span>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {submissions.inquiries && submissions.inquiries.length > 0 ? (
                      submissions.inquiries.map((inquiry, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '1px solid var(--stroke)' }}>
                          <div style={{ flex: 1 }}>
                            <strong>{inquiry.name}</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', marginLeft: '8px' }}>{inquiry.email}</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0' }}>{inquiry.requirements}</p>
                            <small style={{ color: 'var(--muted)' }}>{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}</small>
                          </div>
                          <button 
                            style={{ background: 'none', border: '1px solid var(--stroke)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                            onClick={() => handleDelete('inquiry', inquiry._id)}
                            disabled={deleting === `inquiry-${inquiry._id}`}
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No inquiries yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="card glass-card" style={{ padding: '1.5rem' }}>
                <h3>Website Analytics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '1rem' }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <strong style={{ display: 'block', fontSize: '1.75rem', color: 'var(--primary)' }}>{analytics?.stats?.totalPageViews || 0}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Page Views</span>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <strong style={{ display: 'block', fontSize: '1.75rem', color: 'var(--primary)' }}>{analytics?.stats?.totalProjectViews || 0}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Project Views</span>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <strong style={{ display: 'block', fontSize: '1.75rem', color: 'var(--primary)' }}>{analytics?.stats?.totalResumeDownloads || 0}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Resume Downloads</span>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                    <strong style={{ display: 'block', fontSize: '1.75rem', color: 'var(--primary)' }}>{analytics?.stats?.uniqueVisitors || 0}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Unique Visitors</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="card glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--stroke)' }}>
                  <h3>Newsletter Subscribers</h3>
                  <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>{submissions.newsletters?.length || 0}</span>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {submissions.newsletters && submissions.newsletters.length > 0 ? (
                    submissions.newsletters.map((subscriber, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--stroke)' }}>
                        <div>
                          <strong>{subscriber.email}</strong>
                          <span style={{ fontSize: '0.75rem', marginLeft: '8px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>{subscriber.status}</span>
                          <br />
                          <small style={{ color: 'var(--muted)' }}>Subscribed: {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString() : 'N/A'}</small>
                        </div>
                        <button 
                          style={{ background: 'none', border: '1px solid var(--stroke)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                          onClick={() => handleDelete('newsletter', subscriber._id)}
                          disabled={deleting === `newsletter-${subscriber._id}`}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No subscribers yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Assistant Modal */}
      {aiAssistantOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '1rem' 
          }} 
          onClick={() => setAiAssistantOpen(false)}
        >
          <div 
            style={{ 
              background: 'var(--surface)', 
              borderRadius: '16px', 
              width: '100%', 
              maxWidth: '500px', 
              maxHeight: '80vh', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--stroke)' }}>
              <h3>🤖 AI Assistant</h3>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text)' }}
                onClick={() => setAiAssistantOpen(false)}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiMessages.map((msg, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    maxWidth: '85%', 
                    whiteSpace: 'pre-wrap',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface-elevated)',
                    color: msg.role === 'user' ? 'white' : 'var(--text)',
                    border: msg.role === 'assistant' ? '1px solid var(--stroke)' : 'none'
                  }}
                >
                  {msg.content}
                </div>
              ))}
              {aiLoading && <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', alignSelf: 'flex-start', background: 'var(--surface-elevated)', border: '1px solid var(--stroke)' }}>Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form 
              style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--stroke)' }} 
              onSubmit={handleAiSubmit}
            >
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={aiLoading}
                style={{ 
                  flex: 1, 
                  padding: '0.75rem 1rem', 
                  border: '1px solid var(--stroke)', 
                  borderRadius: '8px', 
                  background: 'var(--background)', 
                  color: 'var(--text)', 
                  fontSize: '0.95rem' 
                }}
              />
              <button 
                type="submit" 
                disabled={aiLoading || !aiInput.trim()}
                style={{ 
                  padding: '0.75rem 1.25rem', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer',
                  opacity: aiLoading || !aiInput.trim() ? 0.6 : 1
                }}
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <strong>Ashutosh Ranjan</strong>
              <p>Full Stack Developer</p>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-social">
  <a href="https://github.com/webdevashu123" target="_blank" rel="noopener" aria-label="GitHub">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.74.5 12.04c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.14 1.18a10.8 10.8 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.6.23 2.78.11 3.07.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.04.78 2.11v3.12c0 .31.21.67.8.56 4.57-1.53 7.86-5.86 7.86-10.97C23.5 5.74 18.27.5 12 .5z" />
    </svg>
    <span>GitHub</span>
  </a>
  <a href="https://www.linkedin.com/in/ashutosh-ranjan-dev/" target="_blank" rel="noopener" aria-label="LinkedIn">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C3.33 3.5 2 4.85 2 6.5s1.33 3 2.98 3h.02c1.66 0 3-1.35 3-3s-1.34-3-3.02-3zM2.4 21.5h5.17V9.74H2.4V21.5zM9.58 9.74v11.76h5.17v-6.56c0-3.47 4.52-3.75 4.52 0v6.56H24V13.1c0-6.2-6.64-5.97-8.78-2.92V9.74H9.58z" />
    </svg>
    <span>LinkedIn</span>
  </a>
  <a href="mailto:helloashutosh1@outlook.com" aria-label="Email">
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z" />
    </svg>
    <span>Email</span>
  </a>
</div>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Ashutosh Ranjan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}




