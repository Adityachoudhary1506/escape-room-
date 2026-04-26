import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registerTeam } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerTeam(teamName, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError("Network Error: Backend server is unreachable or offline.");
      } else {
        setError(err.response.data.message || 'Registration failed');
      }
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div className="panel" style={{ width: '400px' }}>
        <h1 className="glitch-text" data-text="REGISTER TEAM" style={{ textAlign: 'center', width: '100%' }}>REGISTER TEAM</h1>
        {error && <div className="shake-error panel" style={{ color: 'var(--danger-color)', marginBottom: '15px', padding: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="CHOOSE LOGON IDENTITY" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="SECURE ACCESS CODE" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">REGISTER</button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Return to Login</Link>
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

export default Register;
