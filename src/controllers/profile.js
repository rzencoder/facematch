const handleGetProfile = (req, res, knex) => {
    console.log('1')
    const {
        id
    } = req.params;
    knex.select('*').from('users').where({
            id: id
        })
        .then(user => {
            if (user.length) {
                console.log('2')
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error finding user'))
}

const handleProfileUpdate = (req, res, knex) => {
    const {
        id
    } = req.params;
    const {
        username,
        name,
        avatar,
        location
    } = req.body.formInput;
    knex('users')
        .where({
            id: id
        })
        .update({
            username,
            name,
            avatar,
            location
        }, ['id', 'username', 'name', 'location', 'avatar', 'joined', 'entries'])
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error finding user'))
}

module.exports = {
    handleGetProfile: handleGetProfile,
    handleProfileUpdate: handleProfileUpdate
}