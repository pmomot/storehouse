/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Repositories')
        .factory('productRepository', productRepository);

    productRepository.$inject = ['$http', '$q'];

    /**
     * Products Repository
     * */
    function productRepository ($http, $q) {

        /**
         * Get products list form api
         * */
        function fetch () {
            var deferred = $q.defer();

            $http.get('/api/products')
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Create new product
         * @param {Object} product - new product
         * */
        function create (product) {
            var deferred = $q.defer();

            $http.post('/api/products/', product)
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
         * Delete product by id
         * @param {String} id - product id
         * */
        function remove (id) {
            var deferred = $q.defer();

            $http.delete('/api/products/' + id)
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
         * Update product
         * @param {Object} product - object to update
         * */
        function update (product) {
            var deferred = $q.defer();

            $http.put('/api/products/' + product.uuid, product)
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
         * Search product
         * @param {String} text - search query
         * */
        function search (text) {
            var deferred = $q.defer();

            $http.get('/api/products-search?text=' + text)
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
         * Take product from storehouse
         * @param {Object} params - product id and amount to take
         * */
        function take (params) {
            var deferred = $q.defer();

            $http.put('/api/products-take', params)
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
            remove: remove,
            update: update,
            search: search,
            take: take
        };
    }

})();
