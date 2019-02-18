const handleGetProfile = (req, res, knex) => {
    const {
        id
    } = req.params;
    knex.select('*').from('users').where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error finding user'))
}

const handleDeleteProfile = (req, res, knex) => {
    const {
        username
    } = req.body;
    knex('login')
        .where({
            'username': username
        })
        .del()
        .then(() => {
            knex('users')
                .where({
                    'username': username
                })
                .del()
                .then(() => {
                    res.status(200).json('Delete Successful')
                })
                .catch(err => res.status(400).json('Error deleting profile'))
        })
        .catch(err => res.status(400).json('Error deleting profile'))

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
    handleProfileUpdate: handleProfileUpdate,
    handleDeleteProfile: handleDeleteProfile
}