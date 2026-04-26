import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from './Navbar';

export const TeamProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontFamily: 'var(--font-tech)'}}>Loading Systems...</div>;

  return user && user.role === 'team' ? (
    <>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <Outlet />
      </div>
    </>
  ) : <Navigate to="/" />;
};

export const AdminProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontFamily: 'var(--font-tech)'}}>Loading Administrator Privileges...</div>;

  return user && user.role === 'admin' ? (
    <>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <Outlet />
      </div>
    </>
  ) : <Navigate to="/admin" />;
};
