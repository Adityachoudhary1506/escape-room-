import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { AuthContext } from '../../context/AuthContext';

const GameOver = () => {
  const { gameState } = useContext(GameContext);
  const { user } = useContext(AuthContext);

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="panel" style={{ textAlign: 'center', borderColor: 'var(--success-color)', boxShadow: 'var(--success-glow)', padding: '50px', maxWidth: '600px' }}>
        <h1 className="glitch-text" data-text="GAME OVER: ACCOMPLISHED" style={{ color: 'var(--success-color)', marginBottom: '20px', width: '100%' }}>GAME OVER: ACCOMPLISHED</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Congratulations Team <span style={{ color: 'var(--accent-color)' }}>{user?.teamName}</span>. You have successfully escaped.
        </p>

        <div style={{ padding: '20px', border: '1px solid var(--accent-color)', borderRadius: '4px', marginBottom: '30px' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>FINAL TOTAL TIME:</div>
          <div style={{ fontSize: '3rem', fontFamily: 'var(--font-tech)', color: 'var(--accent-color)', textShadow: 'var(--accent-glow)' }}>
            {formatTime(gameState.totalTime)}
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)' }}>
          Your performance has been recorded to the central leaderboard.
        </p>
      </div>
    </div>
  );
};

export default GameOver;
