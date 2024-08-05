const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    mail: String,
    password: String,
    confirmation_code: String,
    is_activated: {
        type: Boolean,
        default: false
    },
    first_name: String,
    last_name : String
},
{
    timestamps: true
});

const Users = mongoose.model("users", userSchema);

const balanceSchema = new Schema({
    mail: String,
    balance: Number
},
{
    timestamps: {updatedAt: true, createdAt: false}
});

const Balances = mongoose.model("balances", balanceSchema);

const transactionsSchema = new Schema({
    amount: Number,
    sender: String,
    receiver: String,  
},
{
    timestamps: {updatedAt: false, createdAt: true}
});

const Transactions = mongoose.model("transactions", transactionsSchema);

module.exports = {
    Users,
    Balances,
    Transactions
};