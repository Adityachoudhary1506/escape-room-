const Team = require('../models/Team');
const bcrypt = require('bcryptjs');

// @desc    Get all teams for leaderboard and status
// @route   GET /api/admin/teams
const getTeams = async (req, res) => {
  try {
    // Sort logic prioritizes highest progress first. 
    // For teams with the same progress, fastest totalTime wins.
    const teams = await Team.find({})
      .select('-password')
      .sort({ progress: -1, totalTime: 1, updatedAt: -1 });
      
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard specifically tracking room 1 completion metrics
// @route   GET /api/admin/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    // Priority: completed room 1 -> true, then fastest room 1 time.
    const teams = await Team.find({ room1Completed: true })
      .select('-password')
      .sort({ room1Completed: -1, room1Time: 1, updatedAt: -1 });
      
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete team
// @route   DELETE /api/admin/team/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    await team.deleteOne();
    res.json({ message: 'Team removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset team password
// @route   PUT /api/admin/team/:id/reset-password
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    team.password = await bcrypt.hash(newPassword, salt);
    await team.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team details
// @route   PUT /api/admin/team/:id
const updateTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (teamName) {
      team.teamName = teamName;
    }

    const updatedTeam = await team.save();
    res.json({ message: 'Team updated successfully', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard specifically tracking room 2 completion metrics
// @route   GET /api/admin/room2-leaderboard
const getRoom2Leaderboard = async (req, res) => {
  try {
    const teams = await Team.find({
      room2Completed: true
    }).sort({ room2Time: 1 });

    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Room2 leaderboard" });
  }
};

// @desc    Get aggregated ultimate winner using total combinatory duration tracking
// @route   GET /api/admin/final-winner
const getFinalWinner = async (req, res) => {
  try {
    const teams = await Team.find({ room1Completed: true, room2Completed: true })
      .select('-password');
    
    if (!teams.length) return res.json(null);
    
    const enriched = teams.map(t => {
      const obj = t.toObject();
      obj.overallTime = (obj.totalTime || 0) + (obj.room2Time || 0);
      return obj;
    });

    enriched.sort((a,b) => a.overallTime - b.overallTime);
    res.json(enriched[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFullProgress = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

const getFinalLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find({
      room1Completed: true,
      room2Completed: true
    });

    const result = teams.map(team => ({
      teamName: team.teamName,
      totalTime: (team.totalTime || 0) + (team.room2Time || 0)
    }));

    result.sort((a, b) => a.totalTime - b.totalTime);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
// @desc    Admin manually unlock room for all teams globally
// @route   POST /api/admin/start-room
const startRoom = async (req, res) => {
  try {
    const { roomNumber } = req.body;
    
    if (roomNumber === 1) {
      await Team.updateMany({}, { $set: { room1Started: true } });
    } else if (roomNumber === 2) {
      await Team.updateMany({}, { $set: { room2Started: true } });
    } else if (roomNumber === 3) {
      await Team.updateMany({}, { $set: { room3Started: true } });
    } else {
      return res.status(400).json({ message: "Invalid room number" });
    }

    res.json({ success: true, message: `Room ${roomNumber} unlocked globally for all teams` });
  } catch (err) {
    res.status(500).json({ message: "Error unlocking room" });
  }
};

module.exports = { getTeams, getLeaderboard, deleteTeam, resetPassword, updateTeam, getRoom2Leaderboard, getFinalWinner, getFullProgress, getFinalLeaderboard, startRoom };
