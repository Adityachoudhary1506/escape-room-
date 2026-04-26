import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>ESCAPE THE MATRIX</div>
      <div style={userSectionStyle}>
        <span style={userStyle}>Team: {user.teamName || 'Administrator'}</span>
        <button onClick={handleLogout} style={btnStyle}>Abort Mission</button>
      </div>
    </nav>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: 'var(--bg-panel)',
  borderBottom: '1px solid var(--accent-color)',
  boxShadow: '0 4px 20px rgba(0, 255, 204, 0.1)'
};

const logoStyle = {
  fontFamily: 'var(--font-tech)',
  fontSize: '1.5rem',
  color: 'var(--accent-color)',
  textShadow: 'var(--accent-glow)',
  fontWeight: 'bold',
  letterSpacing: '3px'
};

const userSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const userStyle = {
  fontFamily: 'var(--font-tech)',
  color: 'var(--text-primary)'
};

const btnStyle = {
  width: 'auto',
  padding: '8px 15px',
  fontSize: '0.8rem',
  border: '1px solid var(--danger-color)',
  color: 'var(--danger-color)',
  marginBottom: '0'
};

export default Navbar;
