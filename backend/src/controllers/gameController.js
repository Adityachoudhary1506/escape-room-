const Team = require('../models/Team');

// @desc    Get current game state for team
// @route   GET /api/game/status
const getGameStatus = async (req, res) => {
  const team = await Team.findById(req.team._id);
  if (!team) return res.status(404).json({ message: 'Team not found' });
  
  res.json({
    progress: team.progress,
    startTime: team.startTime,
    endTime: team.endTime,
    totalTime: team.totalTime,
    room1Completed: team.room1Completed,
    room2Completed: team.room2Completed,
    room3Completed: team.room3Completed,
    room1Failed: team.room1Failed,
    room2Failed: team.room2Failed,
    room3Failed: team.room3Failed,
    room1Started: team.room1Started,
    room2Started: team.room2Started,
    room3Started: team.room3Started
  });
};

// @desc    Start the game (begins timer)
// @route   POST /api/game/start
const startGame = async (req, res) => {
  console.log('--- startGame API Hit ---');
  const team = await Team.findById(req.team._id);
  
  if (team.startTime) {
    console.log('Game already started for team:', team.teamName);
    return res.status(400).json({ message: 'Game already started' });
  }

  team.startTime = new Date();
  await team.save();
  console.log('Game started and startTime saved in DB for:', team.teamName);

  res.json({ startTime: team.startTime });
};

// @desc    Submit puzzle answer for a room
// @route   POST /api/game/submit
const submitPuzzle = async (req, res) => {
  const { answer, roomNumber } = req.body;
  const team = await Team.findById(req.team._id);

  if (team.endTime) {
    return res.status(400).json({ message: 'Game already completed' });
  }

  if (team.progress !== roomNumber) {
    return res.status(400).json({ message: 'You are not in this room' });
  }

  if (roomNumber === 3) {
    team.progress = 3;
    team.room3Completed = true;
    team.endTime = new Date();
    team.totalTime = Math.floor((team.endTime - team.startTime) / 1000);
    await team.save();
    return res.json({ success: true });
  }

  // Example answer keys for the 3 rooms
  const answers = { 1: 'shadow', 2: '427' };

  if (answer.toLowerCase().trim() === answers[roomNumber]) {
    team.progress += 1;

    await team.save();

    res.json({
      success: true,
      progress: team.progress,
      endTime: team.endTime,
      totalTime: team.totalTime,
      message: 'Correct! Progressing...'
    });
  } else {
    res.status(400).json({ success: false, message: 'Incorrect answer.' });
  }
};

// @desc    Complete Room 1 and record metrics
// @route   POST /api/game/complete-room1
const completeRoom1 = async (req, res) => {
  console.log('--- completeRoom1 API Hit ---');
  console.log('Team ID from JWT:', req.team._id);

  const team = await Team.findById(req.team._id);

  if (!team) {
    console.log('Team not found in DB');
    return res.status(404).json({ message: 'Team not found' });
  }

  // Idempotent operation
  if (team.room1Completed) {
    console.log('Room 1 already completed for team:', team.teamName);
    return res.status(400).json({ message: 'Room 1 already completed' });
  }

  const end = Date.now();
  team.room1Time = team.room1StartTime ? Math.floor((end - team.room1StartTime) / 1000) : 0;
  team.room1Completed = true;
  team.progress = 1;

  team.totalTime = 0;
  if (team.room1Completed) team.totalTime += team.room1Time || 0;
  if (team.room2Completed) team.totalTime += team.room2Time || 0;
  if (team.room3Completed) team.totalTime += team.room3Time || 0;

  console.log("Saving progress for:", team.teamName);
  await team.save();
  console.log("Updated Team:", team);

  res.json({
    success: true,
    progress: team.progress,
    room1Completed: team.room1Completed,
    endTime: team.endTime,
    totalTime: team.totalTime,
    message: 'Room 1 successfully logged in DB'
  });
};

// @desc    Start Room 2 and record start time
// @route   POST /api/game/start-room2
const startRoom2 = async (req, res) => {
  console.log('--- startRoom2 API Hit ---');
  const team = await Team.findById(req.team._id);

  if (!team) return res.status(404).json({ message: 'Team not found' });
  if (!team.room2Started) return res.status(403).json({ message: 'Admin has not unlocked this room yet' });

  if (team.room2Start) {
    return res.json({ 
      success: true, 
      room2Start: team.room2Start,
      room2Completed: team.room2Completed
    });
  }

  team.room2Start = new Date();
  await team.save();

  res.json({ success: true, room2Start: team.room2Start, room2Completed: team.room2Completed });
};

// @desc    Complete Room 2 and record metrics
// @route   POST /api/game/complete-room2
const completeRoom2 = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.room2Completed = true;
    team.progress = 2;

    // Save door selected
    team.room2Door = req.body.door || "unknown";

    // Save time
    const end = Date.now();
    team.room2Time = team.room2Start ? Math.floor((end - new Date(team.room2Start)) / 1000) : 0;

    team.totalTime = 0;
    if (team.room1Completed) team.totalTime += team.room1Time || 0;
    if (team.room2Completed) team.totalTime += team.room2Time || 0;
    if (team.room3Completed) team.totalTime += team.room3Time || 0;

    await team.save();

    res.json({ success: true });

  } catch (err) {
    console.error("Room2 Error:", err);
    res.status(500).json({ message: "Room2 failed" });
  }
};

exports.completeRoom3 = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const end = Date.now();
    team.room3Time = team.room3Start ? Math.floor((end - team.room3Start) / 1000) : 0;
    team.room3Completed = true;
    team.progress = 3;

    // 🔥 CORRECT TOTAL TIME
    team.totalTime = 0;
    if (team.room1Completed) team.totalTime += team.room1Time || 0;
    if (team.room2Completed) team.totalTime += team.room2Time || 0;
    if (team.room3Completed) team.totalTime += team.room3Time || 0;

    await team.save();

    console.log("Room3 saved:", team);

    res.json({ success: true, team });

  } catch (err) {
    console.error("Room3 Error:", err);
    res.status(500).json({ message: "Room3 completion failed" });
  }
};

exports.startRoom3 = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.room3Started) return res.status(403).json({ message: 'Admin has not unlocked this room yet' });

    if (team.room3Start) {
      return res.json({ 
        success: true, 
        room3Start: team.room3Start,
        room3Completed: team.room3Completed
      });
    }

    team.room3Start = new Date();
    await team.save();

    res.json({ success: true, room3Start: team.room3Start, room3Completed: team.room3Completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.startRoom1 = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.room1Started) return res.status(403).json({ message: 'Admin has not unlocked this room yet' });

    // If already started, just return current state
    if (team.room1StartTime) {
      return res.json({ 
        success: true, 
        room1StartTime: team.room1StartTime,
        room1Progress: team.room1Progress || 0,
        room1Codes: team.room1Codes || [],
        room1Completed: team.room1Completed
      });
    }

    team.startTime = team.startTime || new Date();
    team.room1StartTime = new Date();
    await team.save();

    res.json({ success: true, room1StartTime: team.room1StartTime, room1Progress: 0, room1Codes: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoom1 = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    res.json({
      room1StartTime: team.room1StartTime,
      room1Progress: team.room1Progress || 0,
      room1Codes: team.room1Codes || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoom1Progress = async (req, res) => {
  try {
    const { progressIndex, collectedCodes } = req.body;
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.room1Progress = progressIndex;
    if (collectedCodes) team.room1Codes = collectedCodes;
    
    await team.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Mark a room as failed when timer runs out
// @route   POST /api/game/fail-room
const failRoom = async (req, res) => {
  try {
    const { roomNumber } = req.body;
    const team = await Team.findById(req.team._id);

    if (!team) return res.status(404).json({ message: "Team not found" });

    const end = Date.now();
    if (roomNumber === 1) {
      team.room1Failed = true;
      team.room1Completed = false;
      team.room1Time = null; // Do not store time on failure
      team.progress = 1; // unlocks room 2
    } else if (roomNumber === 2) {
      team.room2Failed = true;
      team.room2Completed = false;
      team.room2Time = null; // Do not store time on failure
      team.progress = 2; // unlocks room 3
    } else if (roomNumber === 3) {
      team.room3Failed = true;
      team.room3Completed = false;
      team.room3Time = null; // Do not store time on failure
      team.progress = 3; // finishes game
    }

    team.totalTime = 0;
    if (team.room1Completed) team.totalTime += team.room1Time || 0;
    if (team.room2Completed) team.totalTime += team.room2Time || 0;
    if (team.room3Completed) team.totalTime += team.room3Time || 0;

    await team.save();
    res.json({ success: true, message: `Room ${roomNumber} failed successfully. Progress advanced.` });
  } catch (err) {
    console.error("Fail Room Error:", err);
    res.status(500).json({ message: "Failed to process room failure" });
  }
};

module.exports = { 
  getGameStatus, startGame, submitPuzzle, 
  completeRoom1, startRoom2, completeRoom2, 
  completeRoom3: exports.completeRoom3, startRoom3: exports.startRoom3,
  startRoom1: exports.startRoom1, getRoom1: exports.getRoom1, updateRoom1Progress: exports.updateRoom1Progress,
  failRoom
};
