/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Repositories')
        .factory('unitRepository', unitRepository);

    unitRepository.$inject = ['$http', '$q'];
    // TODO SH remove 'Unit' from methods

    /**
     * Units Repository
     * */
    function unitRepository ($http, $q) {

        /**
         * Get units list form api
         * */
        function fetchUnits () {
            var deferred = $q.defer();

            $http.get('/api/units')
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Create new unit
         * @param {Object} unit - new unit of measurement
         * */
        function createUnit (unit) {
            var deferred = $q.defer();

            $http.post('/api/units/', unit)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Delete unit by id
         * @param {String} id - unit id
         * */
        function deleteUnit (id) {
            var deferred = $q.defer();

            $http.delete('/api/units/' + id)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Update unit
         * @param {Object} unit - object to update
         * */
        function updateUnit (unit) {
            var deferred = $q.defer();

            $http.put('/api/units/' + unit.uuid, unit)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        return {
            fetchUnits: fetchUnits,
            createUnit: createUnit,
            deleteUnit: deleteUnit,
            updateUnit: updateUnit
        };
    }

})();
