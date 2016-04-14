/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Repositories')
        .factory('productGroup', productGroup);

    productGroup.$inject = ['$http', '$q'];

    /**
     * Product Groups Repository
     * */
    function productGroup ($http, $q) {

        /**
         * Get product groups list form api
         * */
        function fetch () {
            var deferred = $q.defer();

            $http.get('/api/product-groups')
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Create new unit
         * @param {Object} group - new product group
         * */
        function create (group) {
            var deferred = $q.defer();

            $http.post('/api/product-groups/', group)
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
         * Delete group by id
         * @param {String} id - unit id
         * */
        function drop (id) {
            var deferred = $q.defer();

            $http.delete('/api/product-groups/' + id)
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
         * Update group
         * @param {Object} group - object to update
         * */
        function update (group) {
            var deferred = $q.defer();

            $http.put('/api/product-groups/' + group.uuid, group)
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
            fetch: fetch,
            create: create,
            drop: drop,
            update: update
        };
    }

})();
