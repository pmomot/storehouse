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
        function fetch () {
            var deferred = $q.defer();

            unitRepository.fetch({})
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
        function create (unit) {
            var deferred = $q.defer();

            unitRepository.create(unit)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Delete unit by id
         * @param {String} id - unit id
         * */
        function remove (id) {
            var deferred = $q.defer();

            unitRepository.remove(id)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Update unit
         * @param {Object} unit - object to update
         * */
        function update (unit) {
            var deferred = $q.defer();

            unitRepository.update(unit)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Get stored units list
         * */
        function getUnits () {
            return units;
        }

        /**
         * Get unit of measurement from list by id
         * */
        function getUnitById (id) {
            var i;

            for (i = 0; i < units.length; i += 1) {
                if (units[i].uuid === id) {
                    return units[i];
                }
            }

            return {
                name: '',
                description: ''
            };
        }

        return {
            fetch: fetch,
            create: create,
            remove: remove,
            update: update,

            getUnits: getUnits,
            getUnitById: getUnitById
        };
    }
})();
