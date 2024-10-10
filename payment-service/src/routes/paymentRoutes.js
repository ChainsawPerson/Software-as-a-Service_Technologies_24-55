const express = require('express');
const { purchaseCredits, checkCredits, consumeCredits, availableCredits, clearExpiredCredits } = require('../controllers/paymentController');

const router = express.Router();

// Purchase credits
router.post('/purchase-credits', purchaseCredits);

// Consume credits
router.post('/consume-credits', checkCredits, consumeCredits);

router.get('/available-credits', availableCredits);

//clear the expired credits
router.post('/clear-credits', clearExpiredCredits);

module.exports = router;
