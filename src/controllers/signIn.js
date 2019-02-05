const handleSignIn = (req, res, knex, bcrypt) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(400).json('incorrect form submission');
    }
    knex.select('username', 'hash').from('login')
    .where('username', '=', username)
    .then(data => {
        console.log(req.body)
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid) {
            return knex.select('*').from('users')
            .where('username', '=', username)
            .then(user => {
                console.log(user[0])
                res.json(user[0])
            })
            .catch(err =>res.status(400).json('Unable to find user'))
        }
        res.status(400).json('Incorrect username and/or password')
    })
    .catch(err => res.status(400).json('Incorrect username and/or password'))
}

module.exports = {
    handleSignIn: handleSignIn
}