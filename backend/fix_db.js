const mongoose = require('mongoose');
const Team = require('./src/models/Team');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/escape-room'; 
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/escape-room')
  .then(async () => {
    console.log("Connected to MongoDB");
    let count = 0;
    
    // Fix room 1
    const t1 = await Team.updateMany(
      { room1Failed: true },
      { $set: { room1Time: null, room1Completed: false } }
    );
    console.log("Fixed room 1:", t1.modifiedCount);
    
    // Fix room 2
    const t2 = await Team.updateMany(
      { room2Failed: true },
      { $set: { room2Time: null, room2Completed: false } }
    );
    console.log("Fixed room 2:", t2.modifiedCount);
    
    // Fix room 3
    const t3 = await Team.updateMany(
      { room3Failed: true },
      { $set: { room3Time: null, room3Completed: false } }
    );
    console.log("Fixed room 3:", t3.modifiedCount);
    
    // Recalculate total time
    const allTeams = await Team.find({});
    for (const team of allTeams) {
      team.totalTime = 0;
      if (team.room1Completed) team.totalTime += team.room1Time || 0;
      if (team.room2Completed) team.totalTime += team.room2Time || 0;
      if (team.room3Completed) team.totalTime += team.room3Time || 0;
      await team.save();
    }
    console.log("Recalculated totalTime for all teams");
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
