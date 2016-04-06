/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['productService'];

    /**
     * Products Controller
     * */
    function ProductsController (productService) {
        var vm = this;

        vm.products = productService.getProducts;
        vm.deleteProduct = deleteProduct;

        productService.fetchProducts();

        /**
         * Send request to delete product
         * @param {Object} $event - angular wrapper for js event
         * @param {String} id - product uuid
         * */
        function deleteProduct ($event, id) {
            productService
                .deleteProduct(id)
                .then(function () {
                    if (vm.products().length === 1) {
                        productService.fetchProducts();
                    } else {
                        angular.element($event.target).closest('tr').remove();
                    }
                });
        }
    }

})();
