const Leaderboard = ({ teams }) => {
  // teams is already sorted properly by the backend (room1Completed: -1, totalTime: 1)
  
  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      <h2 style={{ color: '#ffcc00', textShadow: '0 0 10px #ffcc00' }}>🏆 ROOM 1 LEADERBOARD (ESCAPED)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '10px' }}>RANK</th>
            <th style={{ padding: '10px' }}>TEAM NAME</th>
            <th style={{ padding: '10px' }}>FINAL TIME</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t, index) => {
            const isWinner = index === 0 && t.room1Completed;
            return (
              <tr key={t._id} style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: isWinner ? 'rgba(255, 204, 0, 0.1)' : 'transparent',
                boxShadow: isWinner ? 'inset 0 0 15px rgba(255,204,0,0.2)' : 'none'
              }}>
                <td style={{ padding: '15px', fontFamily: 'var(--font-tech)', fontSize: isWinner ? '1.5rem' : '1rem' }}>
                  {isWinner ? '🏆 1' : `#${index + 1}`}
                </td>
                <td style={{ 
                  padding: '15px', 
                  fontWeight: 'bold', 
                  color: isWinner ? '#ffcc00' : 'var(--success-color)',
                  textShadow: isWinner ? '0 0 10px #ffcc00' : 'none',
                  fontSize: isWinner ? '1.5rem' : '1rem',
                  letterSpacing: '1px'
                }}>
                  {t.teamName} {isWinner && <span style={{fontSize:'1rem', marginLeft:'10px'}}>- WINNER</span>}
                </td>
                <td style={{ padding: '15px', fontFamily: 'monospace', color: isWinner ? '#ffcc00' : 'inherit', fontSize: isWinner ? '1.5rem' : '1rem' }}>
                  {formatTime(t.room1Time)}
                </td>
              </tr>
            );
          })}
          {teams.length === 0 && <tr><td colSpan="3" style={{ padding: '10px', textAlign: 'center', color: '#888' }}>No teams have verified completion yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
export default Leaderboard;
