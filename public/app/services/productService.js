/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('productService', productService);

    productService.$inject = ['$q', 'productRepository', 'toastr', '_', 'VALID_TIME_TO_EXPIRE'];

    /**
     * Products processing service
     * */
    function productService ($q, productRepository, toastr, _, VALID_TIME_TO_EXPIRE) {
        var products = [], groups = [], lastSearch = [];

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
         * Search products
         * @param {String} text - search query
         * */
        function search (text) {
            var deferred = $q.defer();

            text = String(text).toLowerCase();

            productRepository.search(text)
                .then(function (data) {
                    lastSearch = data.products;
                    deferred.resolve(data.products);
                })
                .catch(function () {
                    deferred.reject();
                });

            return deferred.promise;
        }

        /**
         * Take product from storehouse
         * @param {Object} params - product id and amount to take
         * */
        function take (params) {
            var deferred = $q.defer();

            productRepository.take(params)
                .then(function (data) {
                    var p;

                    if (data.product.amount === 0) {
                        lastSearch = _.reject(lastSearch, function (item) {
                            return item.uuid === data.product.uuid;
                        });
                    } else {
                        p = _.findWhere(lastSearch, {uuid: data.product.uuid});
                        p.amount = data.product.amount;
                    }

                    deferred.resolve(data.product);
                })
                .catch(function () {
                    deferred.reject();
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

        /**
         * Get last product search list
         * */
        function getLastSearch () {
            return lastSearch;
        }

        // helpers

        /**
         * Process products collection
         * @param {Array} data - list of products
         * */
        function processProducts (data) {
            var tempGroups = ['all'];

            products = data;

            products.forEach(function (p) {
                p.groupsNames = _.pluck(p['ProductGroups'], 'name');

                if (p['minAmount'] >= p['amount']) {
                    p.groupsNames.push('less-amount');
                }

                if (new Date(p['expiresAt']) - new Date() < VALID_TIME_TO_EXPIRE) {
                    p.groupsNames.push('soon-expire');
                }

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
            search: search,
            take: take,

            getProducts: getProducts,
            getGroups: getGroups,
            getLastSearch: getLastSearch
        };
    }
})();
