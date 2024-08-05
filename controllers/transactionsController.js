const { default: mongoose } = require('mongoose');
const {Balances, Transactions} = require('../model/schemas');
const { clients } = require('../model/websockets');

const handleNewTransaction = async (req, res) => {
    const {amount, receiver} = req.body;
    const mail = req.mail;
    
    if(!mail || !amount || !receiver) return res.status(400).json({'error' : 'Missing data for transaction'});

    const session = await mongoose.startSession();
    session.startTransaction();

    const foundSenderBalance = await Balances.findOne({mail: mail}).session(session);

    if(!foundSenderBalance) {
        await session.abortTransaction();
        return res.status(401).json({'error' : 'Failed to authorize user'});
    }

    const foundReceiverBalance = await Balances.findOne({mail: receiver}).session(session);
    
    if(!foundReceiverBalance) {
        await session.abortTransaction();
        return res.status(404).json({'error' : 'Receiver account does not exists'});
    }

    if(amount <= 0) {
        await session.abortTransaction();
        return res.status(400).json({'error' : 'Invalid amount to transfer'});
    }

    if(amount > foundSenderBalance.balance) {
        await session.abortTransaction();
        return res.status(400).json({'error' : 'Not enough money in the account'});
    }

    try{
        await Balances.findOneAndUpdate({mail: mail}, {balance: foundSenderBalance.balance - amount});
        await Balances.findOneAndUpdate({mail: receiver}, {balance: foundReceiverBalance.balance + amount})
        await Transactions.create({amount: amount, sender: mail, receiver: receiver});
        const wsConnections = clients.get(receiver)
        console.log(wsConnections);
        if(wsConnections) {
            for (const connection of wsConnections) {
                connection.send(`Received transaction from ${mail} in the amount ${amount}`);
            }
        }
        await session.commitTransaction();
        res.status(201).json({'success' : 'Transaction completed successfully'});
    } catch(err) {
        await session.abortTransaction();
        res.status(500).json({'error' : 'Failed to complete transaction'});
    } finally {
        await session.endSession();
    }
    
}

const handleTransactions = async (req, res) => {
    console.log("In transaction server");
    const {limit, offset} = req.query;
    if(!limit) limit = 10;
    if(!offset) offset = 0;
    const mail = req.mail;
    if(!mail) return res.status(401).json({'error' : 'Failed to authorize user'});
    const transactionsAmount = await Transactions.countDocuments({$or: [{sender: mail}, {receiver: mail}]});
    const transactions = await Transactions.find({$or: [{sender: mail}, {receiver: mail}]}, {'_id' : 0, '__v' : 0}).skip(offset).limit(limit).sort({_id: -1});
    console.log(`transaction server function : ${transactions}`);
    const totalPages = Math.ceil(transactionsAmount/limit);
    const currentPage = Math.floor(offset/limit + 1);
    res.status(200).json({'transactions' : transactions, 'total_pages' : totalPages, 'current_page' : currentPage, 'total_items' : transactionsAmount})
}

module.exports = {handleNewTransaction, handleTransactions};