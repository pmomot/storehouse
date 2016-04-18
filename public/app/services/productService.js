/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('productService', productService);

    productService.$inject = ['$q', 'productRepository', 'toastr'];

    /**
     * Products processing service
     * */
    function productService ($q, productRepository, toastr) {
        var products = [];

        /**
         * Get products list from server
         * */
        function fetch () {
            var deferred = $q.defer();

            productRepository.fetch({})
                .then(function (data) {
                    products = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Create product
         * @param {Object} product - new product
         * */
        function create (product) {
            var deferred = $q.defer();

            productRepository.create(product)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Delete product by id
         * @param {String} id - product id
         * */
        function remove (id) {
            var deferred = $q.defer();

            productRepository.remove(id)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Update product
         * @param {Object} product - object to update
         * */
        function update (product) {
            var deferred = $q.defer();

            productRepository.update(product)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Get stored products list
         * */
        function getProducts () {
            return products;
        }

        return {
            fetch: fetch,
            create: create,
            remove: remove,
            update: update,

            getProducts: getProducts
        };
    }
})();
