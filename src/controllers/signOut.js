const handleSignOut = (req, res, client) => {
    const {
        authorization
    } = req.headers;
    client.del(authorization, (err, resp) => {
        if (err) {
            res.json('Error')
        } else {
            res.json('Sign out successful')
        }
    })
}

module.exports = {
    handleSignOut: handleSignOut
}