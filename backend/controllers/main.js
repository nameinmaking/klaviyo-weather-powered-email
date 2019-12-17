const getTableData = (req, res, db) => {
    console.log("GET");
    db.select('*').from('subscription')
        .then(items => {
            if (items.length) {
                res.json(items)
            } else {
                res.json({dataExists: 'false'})
            }
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const postTableData = (req, res, db) => {
    const {email, city, longitude, latitude} = req.body
    db('subscription').insert({email, city, longitude, latitude})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const putTableData = (req, res, db) => {
    const {id, email, city, longitude, latitude} = req.body;
    db('subscription').where({id}).update({email, city, longitude, latitude})
        .returning('*')
        .then(item => {
            res.json(item)
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

const deleteTableData = (req, res, db) => {
    const {id} = req.body;
    db('subscription').where({id}).del()
        .then(() => {
            res.json({delete: 'true'})
        })
        .catch(err => res.status(400).json({dbError: 'db error'}))
};

module.exports = {
    getTableData,
    postTableData,
    putTableData,
    deleteTableData
};
