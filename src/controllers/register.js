const handleRegister = (req, res, knex, bcrypt) => {
    const {name, username, password} = req.body;
    if(!name || !username || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, 10);
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            username: username
        })
        .into('login')
        .returning('username')
        .then(loginUsername => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginUsername[0],
                joined: new Date(),
                avatar: 1,
                location: ''
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    
}
module.exports = {
    handleRegister: handleRegister
}