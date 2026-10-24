export default function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="loading-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="spinner"></div>
      <p style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>{message}</p>
    </div>
  );
}
