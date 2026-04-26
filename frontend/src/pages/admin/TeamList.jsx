import API from '../../services/api';

const TeamList = ({ teams, refreshData }) => {
  const activeTeams = teams.filter(t => !t.endTime);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this team?')) {
      try {
        await API.delete(`/admin/team/${id}`);
        if(refreshData) refreshData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting team');
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = window.prompt("Enter new password for this team:");
    if (newPassword) {
      if (newPassword.length < 6) {
        return alert("Password must be at least 6 characters.");
      }
      try {
        await API.put(`/admin/team/${id}/reset-password`, { newPassword });
        alert("Password reset successfully");
      } catch (err) {
        alert(err.response?.data?.message || 'Error resetting password');
      }
    }
  };

  const handleEditTeam = async (id, currentName) => {
    const newName = window.prompt("Enter new team name:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      try {
        await API.put(`/admin/team/${id}`, { teamName: newName });
        if(refreshData) refreshData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error updating team');
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>ALL TEAMS TRACKING</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '10px' }}>TEAM NAME</th>
            <th style={{ padding: '10px' }}>PROGRESS (R1 | R2 | R3)</th>
            <th style={{ padding: '10px' }}>TOTAL TIME</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(t => (
            <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '10px', fontWeight: 'bold', color: t.room1Completed ? 'var(--success-color)' : 'inherit' }}>{t.teamName}</td>
              <td style={{ padding: '10px', fontSize: '1.2rem', letterSpacing: '2px' }}>
                {t.room1Completed ? '🟩' : t.room1Failed ? '🟥' : '⬜'} 
                {t.room2Completed ? '🟩' : t.room2Failed ? '🟥' : '⬜'} 
                {t.room3Completed ? '🟩' : t.room3Failed ? '🟥' : '⬜'}
              </td>
              <td style={{ padding: '10px', fontFamily: 'monospace' }}>
                {t.room1Failed || t.room2Failed || t.room3Failed ? (
                  <span style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>FAILED ❌</span>
                ) : t.totalTime > 0 ? (
                  formatTime(t.totalTime)
                ) : (
                  '—'
                )}
              </td>
              <td style={{ padding: '10px', textAlign: 'right' }}>
                <button 
                  onClick={() => handleEditTeam(t._id, t.teamName)} 
                  style={{ background: '#00aaff', color: '#fff', border: 'none', padding: '6px 12px', marginRight: '8px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Edit
                </button>
                <button 
                  onClick={() => handleResetPassword(t._id)} 
                  style={{ background: '#ffcc00', color: '#000', border: 'none', padding: '6px 12px', marginRight: '8px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Reset PW
                </button>
                <button 
                  onClick={() => handleDelete(t._id)} 
                  style={{ background: '#ff3366', color: '#fff', border: 'none', padding: '6px 12px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(255,51,102,0.3)' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {teams.length === 0 && <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No teams found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
export default TeamList;
