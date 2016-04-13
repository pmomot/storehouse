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
                    message: 'Unit deleted',
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

        Unit.create({

        })
            .then(function () {
                res.send({
                    message: 'Unit created',
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

        Unit.find({
            where: {
                uuid: req.body.uuid
            }
        })
            .then(function (u) {
                //if (u) {
                //    u.
                //    return u.save()
                //}
                res.send({
                    message: 'Unit updated',
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
