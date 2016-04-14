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

        vm.deleteProduct = deleteProduct;

        vm.modalItem = {
            name: '123'
        };
        vm.modalShow = false;
        vm.modalTitle = 'Product form';

        vm.listSettings = {
            addNewLabel: 'Add new product',
            emptyLabel: 'There are no products in storehouse yet :(',
            showPopup: showPopup,
            list: productService.getProducts,
            header: ['Name', 'Description'],
            fields: ['name', 'description']
        };

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
            vm.modalItem = p || {
                name: '',
                description: '',
                amount: 0,
                minAmount: 0,
                arrivedAt: new Date(),
                expiresAt: new Date()
            };

            if (type === 'remove') {
                submitButton = {
                    buttonType: 'submit',
                    value: 'Yes',
                    class: 'btn-danger'
                };
            } else {
                submitButton = {
                    buttonType: 'submit',
                    value: 'Submit',
                    class: 'btn-primary'
                };
            }

            vm.modalButtonsOptions = {
                cancelButton: {
                    buttonType: 'button',
                    value: 'Cancel',
                    class: 'btn-default',
                    callback: 'close'
                },
                submitButton: submitButton,
                callback: submitCallback
            };
            vm.modalShow = true;
        }

        /**
         * Function called from modal in case of submit button click
         * @param {String} type - action type
         * */
        function submitCallback (type) {

            switch (type) {
                case 'remove':
                    deleteProduct(vm.modalItem.uuid);
                    break;
                case 'update':
                    console.log('update', vm.modalItem);
                    break;
                case 'create':
                    console.log('create', vm.modalItem);
                    break;
            }
        }
    }

})();
