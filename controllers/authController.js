const {Users} = require('../model/schemas');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const {mail, password} = req.body;
    const foundUser = await Users.findOne({mail: mail})
    if (!foundUser) return res.status(400).json({'error' : 'Wrong mail or password'});
    if (!foundUser.is_activated) return res.status(401).json({'error' : 'User is not activated'});

    const match = await bcrypt.compare(password, foundUser.password);

    if(match) {
        const accessToken = jwt.sign(
            {'mail' : foundUser.mail, 'first_name' : foundUser.first_name, 'last_name': foundUser.last_name},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '30m'}
        );
        res.cookie('jwt', accessToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000});
        res.status(202).json({'success' : 'Logged in successfully', 'token' : accessToken});
    } else {
        res.status(401).json({'error' : 'Wrong mail or password'});
    }
}

const checkAuth = async (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({'error' : 'Not logged in'})
    const bearer = auth.split(" ")
    const token = bearer[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.mail = decoded.mail;
        console.log(decoded.mail);
        next();
    } catch(err) {
        res.status(401).json({'error' : err.message});
    }

}

module.exports = {handleLogin, checkAuth};