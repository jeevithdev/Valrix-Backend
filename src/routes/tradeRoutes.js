const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/authMiddleware');

router.post('/request',auth,tradeController.createTradeRequest);
router.get('/myrequests',auth,tradeController.myRequests);
router.get('/requests-for-me',auth,tradeController.requestForMe);
router.post('/:id/accept',auth,tradeController.tradeAccept);
router.post('/:id/reject',auth,tradeController.tradeReject);
router.post('/:id/complete',auth,tradeController.completeTrade);

module.exports = router;