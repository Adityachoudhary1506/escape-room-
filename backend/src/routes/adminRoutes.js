const express = require('express');
const router = express.Router();
const { getTeams, getLeaderboard, deleteTeam, resetPassword, updateTeam, getRoom2Leaderboard, getFinalWinner, getFullProgress, getFinalLeaderboard, startRoom } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminGuard');

router.route('/teams').get(adminProtect, getTeams);
router.route('/leaderboard').get(adminProtect, getLeaderboard);
router.route('/room2-leaderboard').get(adminProtect, getRoom2Leaderboard);
router.route('/final-winner').get(adminProtect, getFinalWinner);
router.route('/full-progress').get(adminProtect, getFullProgress);
router.route('/final-leaderboard').get(adminProtect, getFinalLeaderboard);
router.route('/start-room').post(adminProtect, startRoom);

router.route('/team/:id')
  .delete(adminProtect, deleteTeam)
  .put(adminProtect, updateTeam);

router.route('/team/:id/reset-password')
  .put(adminProtect, resetPassword);

module.exports = router;
