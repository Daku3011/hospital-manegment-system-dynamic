const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/inquire', supportController.createInquiry);
router.get('/inquiries', authMiddleware(['admin']), supportController.getInquiries);
router.put('/inquiries/:id', authMiddleware(['admin']), supportController.updateInquiry);

module.exports = router;
