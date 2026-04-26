const express = require('express');
const router = express.Router();
const { getGameStatus, startGame, submitPuzzle, completeRoom1, startRoom2, completeRoom2, completeRoom3, startRoom3, startRoom1, getRoom1, updateRoom1Progress, failRoom } = require('../controllers/gameController');
const { protect } = require('../middleware/authGuard');

router.route('/status').get(protect, getGameStatus);
router.route('/start').post(protect, startGame);
router.route('/submit').post(protect, submitPuzzle);

router.route('/start-room1').post(protect, startRoom1);
router.route('/get-room1').get(protect, getRoom1);
router.route('/update-room1-progress').post(protect, updateRoom1Progress);
router.route('/complete-room1').post(protect, completeRoom1);

router.route('/start-room2').post(protect, startRoom2);
router.route('/complete-room2').post(protect, completeRoom2);
router.route('/start-room3').post(protect, startRoom3);
router.route('/complete-room3').post(protect, completeRoom3);

router.route('/fail-room').post(protect, failRoom);

module.exports = router;
