import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { TeamProtectedRoute, AdminProtectedRoute } from './components/layout/ProtectedRoute';

import RoleSelection from './pages/user/RoleSelection';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Dashboard from './pages/user/Dashboard';
import Room1 from './pages/user/Room1';
import Room2 from './pages/user/Room2';
import Room3 from './pages/user/Room3';
import GameOver from './pages/user/GameOver';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            <Route element={<TeamProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/room1" element={<Room1 />} />
              <Route path="/room2" element={<Room2 />} />
              <Route path="/room3" element={<Room3 />} />
              <Route path="/game-over" element={<GameOver />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
