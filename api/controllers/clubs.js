const Club = require('../models/club');
const mongoose = require('mongoose');

// G1: GET All
exports.get_all_clubs = (req, res, next) => {
    Club.find().select().exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

// P1: POST New Club
exports.post_new_club = (req, res, next) => {
    // Preventing Duplicate Clubs - search by name
    Club.findOne({
        name: req.body.name
    }).exec().then(result => {
        if (result) {
            console.log('Error Duplication: ' + req.body.name);
            res.status(500).json({
                message: 'Error: Club is a duplication'
            });
        } else {
            // Create new club object from body data
            const club = new Club({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                city: req.body.city
            });

            // Save new club to DB
            club.save().then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'New Club Created',
                    result: result
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            });
        }
    });
}

// P2: PATCH Existing Club
exports.patch_existing_club = (req, res, next) => {
    // Lookup existing club by id
    const id = req.params.clubID;
    console.log(id);

    const updateOps = {};
    for (const keys of Object.keys(req.body)) {
        updateOps[keys.whatever] = req.body.keys;
    }
    console.log(updateOps);

    Club.findById(id).exec().then(result => {
        console.log(result);
        if (result) {
            console.log('Yup');

            res.status(200).json({
                message: 'Editing: ' + result.name,
                update: result
            });
        } else {
            res.status(404).json({
                message: 'Club not found'
            });
        }
    }).catch(err => {
        res.status(404).json({
            error: err
        });
    });
}