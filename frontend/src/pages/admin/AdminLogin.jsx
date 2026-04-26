import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(passcode);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized');
    }
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div className="panel" style={{ width: '400px', borderColor: 'var(--danger-color)' }}>
        <h1 style={{ textAlign: 'center', color: 'var(--danger-color)' }}>SYSADMIN OVERRIDE</h1>
        {error && <div className="shake-error panel" style={{ color: 'var(--danger-color)', marginBottom: '15px', padding: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input 
            type="password" 
            placeholder="ENTER AUTHORIZATION CODE" 
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            style={{ borderColor: 'var(--danger-color)' }}
          />
          <button type="submit" style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}>AUTHENTICATE</button>
        </form>
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

export default AdminLogin;
