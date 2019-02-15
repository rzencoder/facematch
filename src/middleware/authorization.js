const requireAuth = (client) => (req, res, next) => {
    const {
        authorization
    } = req.headers;
    if (!authorization) {
        return res.status(401).json("Unauthorized")
    }
    return client.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized')
        }
        console.log('passed')
        return next();
    })
}

module.exports = {
    requireAuth: requireAuth
};