/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('unitService', unitService);

    unitService.$inject = ['$q', 'unitRepository', 'toastr'];

    /**
     * Units processing service
     * */
    function unitService ($q, unitRepository, toastr) {
        var units = [];

        /**
         * Get units list from server
         * */
        function fetchUnits () {
            var deferred = $q.defer();

            unitRepository.fetchUnits({})
                .then(function (data) {
                    units = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Create unit
         * @param {Object} unit - new unit of measurement
         * */
        function createUnit (unit) {
            var deferred = $q.defer();

            unitRepository.createUnit(unit)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetchUnits();
                });

            return deferred.promise;
        }

        /**
         * Delete unit by id
         * @param {String} id - unit id
         * */
        function deleteUnit (id) {
            var deferred = $q.defer();

            unitRepository.deleteUnit(id)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetchUnits();
                });

            return deferred.promise;
        }

        /**
         * Update unit
         * @param {Object} unit - object to update
         * */
        function updateUnit (unit) {
            var deferred = $q.defer();

            unitRepository.updateUnit(unit)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetchUnits();
                });

            return deferred.promise;
        }

        /**
         * Get stored units list
         * */
        function getUnits () {
            return units;
        }

        return {
            fetchUnits: fetchUnits,
            createUnit: createUnit,
            deleteUnit: deleteUnit,
            updateUnit: updateUnit,

            getUnits: getUnits
        };
    }
})();