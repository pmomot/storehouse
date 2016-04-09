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
        function fetchProducts () {
            var deferred = $q.defer();

            productRepository.fetchProducts({})
                .then(function (data) {
                    products = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Delete product by id
         * @param {String} id - product id
         * */
        function deleteProduct (id) {
            var deferred = $q.defer();

            productRepository.deleteProduct(id)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
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
            fetchProducts: fetchProducts,
            deleteProduct: deleteProduct,

            getProducts: getProducts
        };
    }
})();
