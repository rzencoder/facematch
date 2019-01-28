const handleSignIn = (req, res, knex, bcrypt) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    knex.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid) {
            return knex.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                console.log(user[0])
                res.json(user[0])
            })
            .catch(err =>res.status(400).json('Unable to find user'))
        }
        res.status(400).json('Incorrect email and/or password')
    })
    .catch(err => res.status(400).json('Incorrect email and/or password'))
}

module.exports = {
    handleSignIn: handleSignIn
}