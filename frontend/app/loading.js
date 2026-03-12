'use client';

export default function Loading() {
  return (
    <div className="page-container">
      <main className="container section" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    </div>
  );
}
