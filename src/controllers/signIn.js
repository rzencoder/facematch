const jwt = require('jsonwebtoken')

const handleSignIn = (req, res, knex, bcrypt) => {
    const {
        username,
        password
    } = req.body;
    if (!username || !password) {
        return Promise.reject('Incorrect form submission');
    }
    return knex.select('username', 'hash').from('login')
        .where('username', '=', username)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return knex.select('*').from('users')
                    .where('username', '=', username)
                    .then(user => {
                        console.log(user[0])
                        return user[0]
                    })
                    .catch(err => Promise.reject('Unable to find user'))
            } else {
                const errMessage = {
                    'err': 'Incorrect username and/or password'
                }
                throw errMessage;
            }
        })
        .catch(err => Promise.reject('Incorrect username and/or password'))
}

const getAuthToken = (req, res, client) => {
    const {
        authorization
    } = req.headers;
    return client.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({
            id: reply
        });
    })
}

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
        .catch(() => Promise.reject('Error creating session'))

}

const signinAuth = (req, res, knex, bcrypt, client) => {
    const {
        authorization
    } = req.headers;
    return authorization ? getAuthToken(req, res, client) :
        handleSignIn(req, res, knex, bcrypt)
        .then(data => {
            console.log('data', data)
            return data.username && data.id ? createSession(data, client) : Promise.reject(data);
        })
        .then(session => {
            res.json(session)
        })
        .catch(err => {
            return res.status(400).json(err)
        })

}

module.exports = {
    signinAuth: signinAuth
}