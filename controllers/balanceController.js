const {Balances, Users} = require('../model/schemas');

const handleGetBalance = async (req, res) => {
    const mail = req.mail;
    if(!mail) return res.status(400).json({'error' : 'Missing data'});
    const foundBalance = await Balances.findOne({mail: mail});
    const foundUser = await Users.findOne({mail: mail});
    if(!foundBalance || !foundUser || foundUser.is_activated === false) return res.status(401).json({'error' : 'Failed to authorize user'});
    // console.log(foundBalance.balance);
    res.status(200).json({'balance' : foundBalance.balance, 'user_name' : foundUser.first_name, 'mail' : mail});
}

module.exports = {handleGetBalance};