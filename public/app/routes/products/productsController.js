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
        vm.showPopup = showPopup;

        vm.modalItem = {
            name: '123'
        };
        vm.modalShow = false;
        vm.modalTitle = 'Product form';

        productService.fetchProducts();

        /**
         * Send request to delete product
         * @param {String} id - product uuid
         * */
        function deleteProduct (id) {
            productService
                .deleteProduct(id)
                .then(function () {
                    if (vm.products().length === 1) { // amount doesn't change TODO SH think about this
                        productService.fetchProducts();
                    } else {
                        angular.element('[data-id="' + id + '"').remove();
                    }
                });
        }

        /**
         * Show create/update/remove popup for product
         * @param {String} type - popup type
         * @param {Object} p - product
         * */
        function showPopup (type, p) {
            var submitButton;

            vm.modalType = type;
            vm.modalTitle = 'Product ' + type;
            vm.modalItem = p || {};

            if (type === 'remove') {
                submitButton = {
                    buttonType: 'submit',
                    caption: 'Yes',
                    class: 'btn-danger'
                };
            } else {
                submitButton = {
                    buttonType: 'submit',
                    caption: 'Submit',
                    class: 'btn-primary'
                };
            }

            vm.modalButtonsOptions = {
                buttons: [
                    {
                        buttonType: 'button',
                        caption: 'Cancel',
                        class: 'btn-default'
                    },
                    submitButton
                ],
                callback: buttonCallback
            };
            vm.modalShow = true;
        }

        /**
         * Function called from modal in case of submit button click
         * @param {String} type - action type
         * */
        function buttonCallback (type) {

            switch (type) {
                case 'remove':
                    deleteProduct(vm.modalItem.uuid);
                    break;
            }
        }
    }

})();
