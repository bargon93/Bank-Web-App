const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionsController');
let clients = [];
router.post('/', authController.checkAuth, transactionController.handleNewTransaction)
.get('/', authController.checkAuth, transactionController.handleTransactions)
.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write('data check');

    const clientMail = req.query
});

module.exports = router;