/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['productService', 'MODAL_SETTINGS', 'MODAL_BUTTONS'];

    /**
     * Products Controller
     * */
    function ProductsController (productService, MODAL_SETTINGS, MODAL_BUTTONS) {
        var vm = this;

        vm.listSettings = {
            addNewLabel: 'Add new product',
            emptyLabel: 'There are no products in storehouse yet :(',
            showPopup: showPopup,
            list: productService.getProducts,
            header: ['Name', 'Description'],
            fields: ['name', 'description']
        };

        vm.modalSettings = angular.extend(MODAL_SETTINGS, {
            buttonsOptions: {
                cancelButton: MODAL_BUTTONS.CANCEL,
                callback: submitCallback,
                submitButton: {}
            }
        });

        productService.fetchProducts();

        /**
         * Send request to delete product
         * @param {String} id - product uuid
         * */
        function deleteProduct (id) {
            return productService
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
        function showPopup (type, item) {
            var submitButton = type === 'remove' ? MODAL_BUTTONS.REMOVE : MODAL_BUTTONS.SUBMIT;

            if (item) {
                item = JSON.parse(JSON.stringify(item));
            } else {
                item = {
                    name: '',
                    description: '',
                    amount: 0,
                    minAmount: 0,
                    arrivedAt: new Date(),
                    expiresAt: new Date()
                };
            }

            angular.extend(vm.modalSettings, {
                type: type,
                title: 'Product ' + type,
                item: item,
                size: type === 'remove' ? 'small' : '',
                buttonsOptions: angular.extend(vm.modalSettings.buttonsOptions, {
                    submitButton: submitButton
                })
            });
        }

        /**
         * Function called from modal in case of submit button click
         * @param {Object} modalElement - modal dom el
         * */
        function submitCallback (modalElement) {
            var type = vm.modalSettings.type, // action type
                ajaxParam = vm.modalSettings.item;

            // TODO SH complete this

            switch (type) {
                case 'remove':
                    deleteProduct(vm.modalItem.uuid)
                        .then(function () {
                            angular.element(modalElement).modal('hide');
                        });
                    break;
                case 'update':
                    console.log('update', ajaxParam);
                    break;
                case 'create':
                    console.log('create', ajaxParam);
                    break;
            }
        }
    }

})();
