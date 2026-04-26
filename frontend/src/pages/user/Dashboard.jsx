import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from '../../context/GameContext';

const Dashboard = () => {
  const { gameState, startGame, fetchGameStatus } = useContext(GameContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { progress, endTime, startTime, room1Completed, room2Completed, room3Completed, room1Failed, room2Failed, room3Failed, room1Started, room2Started, room3Started, totalTime, teamName } = gameState || {};
  const isCompleted = !!endTime || room3Completed || room3Failed || progress > 3;

  useEffect(() => {
    fetchGameStatus();

    const handleFocus = () => {
      fetchGameStatus();
    };

    window.addEventListener('focus', handleFocus);
    const intervalId = setInterval(fetchGameStatus, 3000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [location.pathname, fetchGameStatus]);

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getStatus = (roomNum) => {
    if (roomNum === 1) {
      if (room1Failed) return 'FAILED';
      if (room1Completed) return 'COMPLETED';
      if (!room1Started) return 'LOCKED';
      if (progress === 0 || progress === 1) return 'UNLOCKED';
    }
    if (roomNum === 2) {
      if (room2Failed) return 'FAILED';
      if (room2Completed) return 'COMPLETED';
      if (!room2Started) return 'LOCKED';
      if (room1Completed || room1Failed) return 'UNLOCKED';
    }
    if (roomNum === 3) {
      if (room3Failed) return 'FAILED';
      if (room3Completed) return 'COMPLETED';
      if (!room3Started) return 'LOCKED';
      if (room2Completed || room2Failed) return 'UNLOCKED';
    }
    if (isCompleted) return 'COMPLETED';
    if (progress > roomNum) return 'COMPLETED';
    if (progress === roomNum) return 'UNLOCKED';
    return 'LOCKED';
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="glitch-text" data-text="NODE MATRIX TERMINAL" style={{ textAlign: 'center', marginBottom: '10px', width: '100%' }}>NODE MATRIX TERMINAL</h1>
      
      {teamName && (
         <div style={{ textAlign: 'center', color: 'var(--accent-color)', marginBottom: '30px', fontSize: '1.2rem', letterSpacing: '2px' }}>
           TEAM: {teamName}
         </div>
      )}

      {isCompleted ? (
        <div className="panel" style={{ textAlign: 'center', padding: '40px', borderColor: 'var(--success-color)', boxShadow: '0 0 30px rgba(0,255,204,0.3)' }}>
          <h2 className="glitch-text" data-text="SYSTEM SECURED" style={{ color: 'var(--success-color)', fontSize: '3rem', marginBottom: '20px' }}>SYSTEM SECURED</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#fff' }}>All Nodes Neutralized. Excellent work, Operative.</p>
          
          <div style={{ background: '#111', padding: '30px', borderRadius: '10px', border: '1px solid var(--accent-color)' }}>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: '20px', fontSize: '2rem' }}>FINAL REPORT</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(176,38,255,0.5)' }}>
              TOTAL ESCAPE TIME: <span style={{ color: (room1Failed || room2Failed || room3Failed) ? 'var(--danger-color)' : '#fff' }}>
                {(room1Failed || room2Failed || room3Failed) ? 'FAILED ❌' : formatTime(totalTime)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {[1, 2, 3].map(room => (
            <div 
              key={room} 
              className="panel" 
              style={{ 
                opacity: getStatus(room) === 'LOCKED' ? 0.5 : 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderColor: getStatus(room) === 'UNLOCKED' ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'
              }}
            >
              <div>
                <h2>SECTOR {room}</h2>
                <div style={{ color: getStatus(room) === 'CLEARED' || getStatus(room) === 'COMPLETED' ? 'var(--success-color)' : getStatus(room) === 'FAILED' ? 'var(--danger-color)' : 'var(--text-secondary)', fontWeight: 'bold' }}>
                  STATUS: {getStatus(room)}
                </div>
              </div>
              <button 
                onClick={() => navigate(`/room${room}`)}
                disabled={getStatus(room) === 'LOCKED' || getStatus(room) === 'FAILED'}
                style={{ 
                  width: 'auto', 
                  opacity: getStatus(room) === 'LOCKED' || getStatus(room) === 'FAILED' ? 0.5 : 1,
                  display: (getStatus(room) === 'CLEARED' || getStatus(room) === 'COMPLETED' || getStatus(room) === 'FAILED') ? 'none' : 'block'
                }}
              >
                {getStatus(room) === 'UNLOCKED' ? 'ENTER SECTOR' : 'ACCESS DENIED'}
              </button>
            </div>
          ))}

          {isCompleted && (
            <div className="panel fade-in" style={{ textAlign: 'center', borderColor: 'var(--success-color)' }}>
              <h2 style={{ color: 'var(--success-color)' }}>ALL SECTORS CLEARED</h2>
              <button onClick={() => navigate('/game-over')} style={{ marginTop: '20px', maxWidth: '300px' }}>VIEW FINAL REPORT</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
