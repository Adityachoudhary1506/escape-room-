import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginTeam } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginTeam(teamName, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div className="panel" style={{ width: '400px' }}>
        <h1 className="glitch-text" data-text="SYSTEM LOGIN" style={{ textAlign: 'center', width: '100%' }}>SYSTEM LOGIN</h1>
        {error && <div className="shake-error panel" style={{ color: 'var(--danger-color)', marginBottom: '15px', padding: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            placeholder="TEAM IDENTITY" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="ACCESS CODE" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">INITIALIZE</button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Or Register New Team</Link>
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

export default Login;
