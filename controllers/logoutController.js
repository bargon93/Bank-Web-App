const handleLogout = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({'success' : 'Logged out successfully'})
}

module.exports = {handleLogout};