import { useState, useEffect } from 'react';
import API from '../../services/api';
import TeamList from './TeamList';
import Leaderboard from './Leaderboard';
import axios from 'axios';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [room2Leaderboard, setRoom2Leaderboard] = useState([]);
  const [finalWinner, setFinalWinner] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await API.get('/admin/teams');
      setTeams(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/admin/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoom2Leaderboard = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get("https://escape-room-vgd1.onrender.com/api/admin/room2-leaderboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Room2 Data:", res.data);
      setRoom2Leaderboard(res.data);
    } catch (err) {
      console.error("Error fetching Room2:", err);
    }
  };

  const fetchFinalWinner = async () => {
    try {
      const res = await API.get('/admin/final-winner');
      setFinalWinner(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFull = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get("https://escape-room-vgd1.onrender.com/api/admin/full-progress", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFullData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchFinal = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get("https://escape-room-vgd1.onrender.com/api/admin/final-leaderboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinalData(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const fetchAll = () => {
      fetchTeams();
      fetchLeaderboard();
      fetchRoom2Leaderboard();
      fetchFinalWinner();
      fetchFull();
      fetchFinal();
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Data...</div>;

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' }}>
      <h1 className="glitch-text" data-text="OVERSEER DASHBOARD" style={{ textAlign: 'center', marginBottom: '40px', width: '100%' }}>OVERSEER DASHBOARD</h1>
      
      {/* FINAL WINNER BANNER */}
      {(() => {
        const winner = fullData
          .filter(team => team.progress === 3)
          .sort((a, b) => a.totalTime - b.totalTime)[0];

        if (!winner) return null;

        return (
          <div style={{
            background: 'rgba(255, 204, 0, 0.15)',
            border: '2px solid #ffcc00',
            borderRadius: '12px',
            padding: '30px',
            margin: '0 auto 40px',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(255, 204, 0, 0.3)',
            animation: 'pulse 2s infinite'
          }}>
            <h2 style={{ color: '#ffcc00', letterSpacing: '5px', marginBottom: '10px', textShadow: '0 0 10px #ffcc00' }}>👑 FINAL WINNER 👑</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>
              {winner.teamName}
            </div>
            <div style={{ fontSize: '1.2rem', color: '#ffcc00', fontFamily: 'monospace' }}>
              TOTAL TIME (ALL ROOMS): {winner.totalTime ? formatTime(winner.totalTime) : "00:00"}
            </div>
          </div>
        );
      })()}

      <div className="panel" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '20px' }}>GLOBAL ROOM CONTROLS</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {[1, 2, 3].map(room => (
            <button
              key={room}
              onClick={async () => {
                if (window.confirm(`Are you sure you want to unlock Room ${room} globally?`)) {
                  try {
                    const token = sessionStorage.getItem('token');
                    await axios.post("https://escape-room-vgd1.onrender.com/api/admin/start-room", 
                      { roomNumber: room },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert(`Room ${room} unlocked for all teams!`);
                  } catch (err) {
                    alert("Error unlocking room");
                  }
                }
              }}
              style={{
                background: 'var(--accent-color)',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              START ROOM {room}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <TeamList teams={teams} refreshData={() => { fetchTeams(); fetchLeaderboard(); fetchRoom2Leaderboard(); fetchFinalWinner(); }} />
        
        <Leaderboard teams={leaderboard} />

        {/* ROOM 2 LEADERBOARD */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ color: '#00ffcc', textShadow: '0 0 10px #00ffcc', marginBottom: '10px' }}>🌐 ROOM 2 LEADERBOARD (ESCAPED)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px' }}>RANK</th>
                <th style={{ padding: '15px' }}>TEAM NAME</th>
                <th style={{ padding: '15px' }}>DOOR</th>
                <th style={{ padding: '15px' }}>TIME TAKEN</th>
              </tr>
            </thead>
            <tbody>
              {room2Leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No teams have bypassed Room 2 yet.</td>
                </tr>
              ) : (
                room2Leaderboard.map((t, index) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '1.2rem' }}>#{index + 1}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#00ffcc' }}>{t.teamName}</td>
                    <td style={{ padding: '15px', color: '#aaa', textTransform: 'uppercase' }}>{t.room2Door === 'd1' ? 'DOOR 1 (CODING)' : t.room2Door === 'd2' ? 'DOOR 2 (LOGIC)' : 'UNKNOWN'}</td>
                    <td style={{ padding: '15px', fontFamily: 'monospace', color: '#fff' }}>{formatTime(t.room2Time)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* ROOM 3 LEADERBOARD */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ color: '#b026ff', textShadow: '0 0 10px #b026ff', marginBottom: '10px' }}>🔐 ROOM 3 LEADERBOARD (SYSTEM COMPROMISED)</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px' }}>RANK</th>
                <th style={{ padding: '15px' }}>TEAM NAME</th>
                <th style={{ padding: '15px' }}>TIME TAKEN</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const room3Leaderboard = fullData
                  .filter(team => team.room3Completed)
                  .sort((a, b) => (a.room3Time || 0) - (b.room3Time || 0));

                if (room3Leaderboard.length === 0) {
                  return (
                    <tr>
                      <td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No teams have compromised Room 3 yet.</td>
                    </tr>
                  );
                }

                return room3Leaderboard.map((t, index) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '1.2rem' }}>#{index + 1}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#b026ff' }}>{t.teamName}</td>
                    <td style={{ padding: '15px', fontFamily: 'monospace', color: '#fff' }}>{formatTime(t.room3Time)}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
        {/* UI SECTION 1 - FULL PROGRESS */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ color: '#fff', marginBottom: '10px' }}>ALL TEAMS PROGRESS</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '15px' }}>Team Name</th>
                <th style={{ padding: '15px' }}>Room1</th>
                <th style={{ padding: '15px' }}>Room2</th>
                <th style={{ padding: '15px' }}>Room3</th>
                <th style={{ padding: '15px' }}>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {fullData.length === 0 && <tr><td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No data available</td></tr>}
              {fullData.map((t, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px' }}>{t.teamName}</td>
                  <td style={{ padding: '15px' }}>
                    {t.room1Completed ? "✅" : "❌"} <br/>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{formatTime(t.room1Time)}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {t.room2Completed ? "✅" : "❌"} <br/>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{formatTime(t.room2Time)}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {t.room3Completed ? "✅" : "❌"} <br/>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{formatTime(t.room3Time)}</span>
                  </td>
                  <td style={{ padding: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>{formatTime(t.totalTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UI SECTION 2 - FINAL LEADERBOARD */}
        <div style={{ marginTop: '50px' }}>
          {(() => {
            const finalLeaderboard = fullData
              .filter(team => team.progress === 3)
              .sort((a, b) => a.totalTime - b.totalTime);

            const winner = finalLeaderboard[0];

            return (
              <>
                {winner && (
                  <div style={{
                    background: "#111",
                    padding: "20px",
                    border: "2px solid gold",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    textAlign: "center"
                  }}>
                    🏆 WINNER: {winner.teamName}
                    <br />
                    ⏱ Time: {formatTime(winner.totalTime)}
                  </div>
                )}

                <h2 style={{ color: '#fff', marginBottom: '10px' }}>FINAL LEADERBOARD</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '15px' }}>Rank</th>
                      <th style={{ padding: '15px' }}>Team Name</th>
                      <th style={{ padding: '15px' }}>Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalLeaderboard.length === 0 && <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No teams have finished all rooms yet.</td></tr>}
                    {finalLeaderboard.map((t, idx) => (
                      <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '15px' }}>{idx + 1}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{t.teamName}</td>
                        <td style={{ padding: '15px', fontFamily: 'monospace' }}>{formatTime(t.totalTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;
