/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('productService', productService);

    productService.$inject = ['$q', 'productRepository', 'toastr', '_'];

    /**
     * Products processing service
     * */
    function productService ($q, productRepository, toastr, _) {
        var products = [], groups = [];

        /**
         * Get products list from server
         * */
        function fetch () {
            var deferred = $q.defer();

            productRepository.fetch({})
                .then(function (data) {
                    processProducts(data);
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
                    processProducts(data.products);

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

        /**
         * Get product groups list
         * */
        function getGroups () {
            return groups;
        }

        // helpers

        /**
         * Process products collection
         * @param {Array} data - list of products
         * */
        function processProducts (data) {
            var tempGroups = ['All'];

            products = data;

            products.forEach(function (p) {
                p.groupsNames = _.pluck(p['ProductGroups'], 'name');
                tempGroups = _.union(tempGroups, p.groupsNames);
            });

            if (tempGroups.length > 2) {
                groups = tempGroups;
            } else {
                groups = [];
            }
        }

        return {
            fetch: fetch,
            create: create,
            remove: remove,
            update: update,

            getProducts: getProducts,
            getGroups: getGroups
        };
    }
})();
