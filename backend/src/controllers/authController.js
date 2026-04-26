const Team = require('../models/Team');
const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'team') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new team
// @route   POST /api/auth/register
const registerTeam = async (req, res) => {
  const { teamName, password } = req.body;

  try {
    const teamExists = await Team.findOne({ teamName });
    if (teamExists) {
      console.log(`[AUTH LOG] Discarded duplicate registration for: ${teamName}`);
      return res.status(400).json({ message: 'Team already exists. Choose another name.' });
    }

    const team = await Team.create({ teamName, password });
    console.log(`[AUTH LOG] Successfully registered new team: ${teamName}`);

    res.status(201).json({
      _id: team._id,
      teamName: team.teamName,
      progress: team.progress,
      token: generateToken(team._id),
      role: 'team'
    });
  } catch (error) {
    console.error("[AUTH ERROR] Registration failed:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
};

// @desc    Auth team & get token
// @route   POST /api/auth/login
const loginTeam = async (req, res) => {
  const { teamName, password } = req.body;

  try {
    const team = await Team.findOne({ teamName });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (await team.matchPassword(password)) {
      res.json({
        _id: team._id,
        teamName: team.teamName,
        progress: team.progress,
        totalTime: team.totalTime,
        token: generateToken(team._id),
        role: 'team'
      });
    } else {
      res.status(401).json({ message: 'Wrong password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth Admin
// @route   POST /api/auth/admin
const loginAdmin = async (req, res) => {
  const { passcode } = req.body;

  if (passcode === process.env.ADMIN_PASSCODE) {
    res.json({
      role: 'admin',
      token: generateToken('admin_id', 'admin')
    });
  } else {
    res.status(401).json({ message: 'Invalid admin passcode' });
  }
};

module.exports = { registerTeam, loginTeam, loginAdmin };
