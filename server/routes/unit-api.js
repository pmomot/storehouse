/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

module.exports = function (Unit) {

    /**
     * Get all units list
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function getUnits (req, res) {
        Unit.findAll({
            attributes: ['uuid', 'name', 'description']
        })
            .then(function (Units) {
                res.send(Units);
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Delete unit by id
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function deleteUnit (req, res) {

        Unit.destroy({
            where: {
                uuid: req.params.id
            }
        })
            .then(function () {
                res.send({
                    message: 'Unit of measurement deleted',
                    success: true
                });
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Create new unit
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function createUnit (req, res) {
        Unit.create(req.body)
            .then(function () {
                res.send({
                    message: 'Unit of measurement created',
                    success: true
                });
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    /**
     * Update unit
     * @param {Object} req - request
     * @param {Object} res - response
     * */
    function updateUnit (req, res) {
        var u = req.body;

        Unit.find({
            where: {
                uuid: req.body.uuid
            }
        })
            .then(function (unit) {
                if (unit) {
                    unit.name = u.name;
                    unit.description = u.description;
                    return unit.save();
                } else {
                    throw new Error('Unit of measurement does not exists');
                }
            })
            .then(function () {
                res.send({
                    message: 'Unit of measurement updated',
                    success: true
                });
            })
            .catch(function (error) {
                res.send({
                    message: error.message,
                    success: false
                });
            });
    }

    return {
        getUnits: getUnits,
        deleteUnit: deleteUnit,
        createUnit: createUnit,
        updateUnit: updateUnit
    };
};
