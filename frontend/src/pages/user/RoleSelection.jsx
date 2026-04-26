import { Link } from 'react-router-dom';

const RoleSelection = () => {
  return (
    <div className="fade-in" style={containerStyle}>
      <div className="panel" style={{ width: '400px', textAlign: 'center' }}>
        <h1 className="glitch-text" data-text="SYSTEM INITIATION" style={{ width: '100%', marginBottom: '40px' }}>SYSTEM INITIATION</h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Select your access protocol to continue:
        </p>

        <div style={{ display: 'grid', gap: '20px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="pulse-glow" style={{ fontSize: '1.1rem', padding: '15px', width: '100%' }}>
              LOGIN AS TEAM
            </button>
          </Link>
          
          <Link to="/admin-login" style={{ textDecoration: 'none' }}>
            <button style={{ 
              fontSize: '1rem', 
              padding: '15px', 
              borderColor: 'var(--danger-color)', 
              color: 'var(--danger-color)',
              width: '100%'
            }}>
              LOGIN AS ADMINISTRATOR
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default RoleSelection;
