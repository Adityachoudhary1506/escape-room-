const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  progress: {
    type: Number,
    default: 0, // Starts at 0, goes to 1 when Room 1 logic finishes
  },
  room1Completed: {
    type: Boolean,
    default: false,
  },
  room2Completed: {
    type: Boolean,
    default: false,
  },
  room3Completed: {
    type: Boolean,
    default: false,
  },
  room1Failed: { type: Boolean, default: false },
  room2Failed: { type: Boolean, default: false },
  room3Failed: { type: Boolean, default: false },
  room2Door: {
    type: String, // "d1" or "d2"
  },
  room1Progress: { type: Number, default: 0 },
  room1Codes: { type: [String], default: [] },
  room1Time: { type: Number, default: null },
  room2Time: { type: Number, default: null },
  room3Time: { type: Number, default: null },
  room1StartTime: { type: Date, default: null },
  room1Start: { type: Date, default: null },
  room2Start: { type: Date, default: null },
  room3Start: { type: Date, default: null },
  room1Started: { type: Boolean, default: false },
  room2Started: { type: Boolean, default: false },
  room3Started: { type: Boolean, default: false },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  totalTime: {
    type: Number, // Stored in seconds for leaderboard
    default: 0,
  }
}, { timestamps: true });

// Hash password before saving
teamSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare hashed passwords
teamSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Team', teamSchema);
