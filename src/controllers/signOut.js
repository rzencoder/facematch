const handleSignOut = (req, res, client) => {
    const {
        authorization
    } = req.headers;
    //Deleting token from redis db on signout
    client.del(authorization, (err, resp) => {
        if (err) {
            res.json('Error signing out')
        } else {
            res.json('Sign out successful')
        }
    })
}

module.exports = {
    handleSignOut: handleSignOut
}