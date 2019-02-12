const jwt = require('jsonwebtoken');

const signToken = (username) => {
    const jwtPayload = {
        username
    };
    return jwt.sign(jwtPayload, process.env.JWTSECRET, {
        expiresIn: '2 days'
    });
}

const setToken = (id, token, client) => {
    return Promise.resolve(client.set(token, id))
}

const createSession = (user, client) => {
    const {
        username,
        id
    } = user;
    const token = signToken(username);
    return setToken(id, token, client)
        .then(() => {
            return {
                success: 'true',
                id: id,
                token: token
            }
        })
        .catch(() => Promise.reject('Error Creating Session'))

}

const handleRegister = (req, res, knex, bcrypt, client) => {
    const {
        name,
        username,
        password
    } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json('Incorrect form submission');
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
                        username: loginUsername[0],
                        joined: new Date(),
                        avatar: 1,
                        location: ''
                    }).then(user => {
                        createSession(user[0], client)
                            .then(session => {
                                res.json(session);
                            }).catch(err => {
                                res.status(400).json(err)
                            })

                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })

}
module.exports = {
    handleRegister: handleRegister
}