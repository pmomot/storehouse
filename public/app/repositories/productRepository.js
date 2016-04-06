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
        function fetchProducts () {
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
         * Delete product by id
         * @param {String} id - product id
         * */
        function deleteProduct (id) {
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

        return {
            fetchProducts: fetchProducts,
            deleteProduct: deleteProduct
        };
    }

})();
