const {Users, Balances} = require('../model/schemas');

const handleConfirmation = async (req, res) => {
    const {mail, code} = req.body;

    const foundUser = await Users.findOne({mail: mail});
    if(!foundUser) return res.status(400).json({'error' : 'User not found'});
    try {
        if(Date.now() - foundUser.createdAt > 1800000) {
            await Users.deleteOne({mail: mail});
            return res.status(410).json({'error' : 'Confirmation code expired'});
        }

        if(code != foundUser.confirmation_code) {
            return res.status(400).json({'error' : 'Wrong confirmation code'})
        }
        await Users.findOneAndUpdate({mail : mail}, {is_activated: true});
        const newBalance = {'mail' : mail, 'balance' : Math.floor(Math.random() * 1000)};
        await Balances.create(newBalance);

        res.status(202).json({'success' : 'User confirmation completed'})
    } catch (err) {
        res.status(500).json({'error' : err.message});
    }

}

module.exports = {handleConfirmation};