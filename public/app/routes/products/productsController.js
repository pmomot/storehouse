/**
 * Created by pmomot on 4/6/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ProductsController', ProductsController);

    ProductsController.$inject = ['productService', 'MODAL_SETTINGS', 'MODAL_BUTTONS',
        'unitService', 'productGroupService', 'accountService'];

    /**
     * Products Controller
     * */
    function ProductsController (productService, MODAL_SETTINGS, MODAL_BUTTONS, unitService, productGroupService, accountService) {
        var vm = this;

        vm.units = unitService.getUnits;
        vm.unitById = unitService.getUnitById;
        vm.productGroups = productGroupService.getGroups;
        vm.productGroupsByIds = productGroupService.getGroupsByIds;
        vm.ln = accountService.getLocalization;
        vm.selectedGroups = productService.getGroups;
        vm.activeTag = 'all';
        vm.lnTags = ['all', 'less-amount', 'soon-expire'];

        vm.filterByTag = filterByTag;

        vm.listSettings = {
            addNewLabel: 'Add new product',
            emptyLabel: 'There are no products in storehouse yet :(',
            showPopup: showPopup,
            list: productService.getProducts,
            header: ['Name', 'Description'],
            fields: ['name', 'description'],
            type: 'products'
        };

        vm.modalSettings = angular.extend(MODAL_SETTINGS, {
            buttonsOptions: {
                cancelButton: MODAL_BUTTONS.CANCEL,
                callback: submitCallback,
                submitButton: {}
            },
            units: vm.units,
            productGroups: vm.productGroups
        });

        productService.fetch();
        unitService.fetch(); // TODO SH move this to pre loaded functionality
        productGroupService.fetch(); // TODO SH move this to pre loaded functionality

        /**
         * Show create/update/remove popup for product
         * @param {String} type - popup type
         * @param {Object} item - product
         * */
        function showPopup (type, item) {
            var submitButton = type === 'remove' ? MODAL_BUTTONS.REMOVE : MODAL_BUTTONS.SUBMIT;

            if (item) {
                item = JSON.parse(JSON.stringify(item));
                item.arrivedAt = new Date(item.arrivedAt);
                item.expiresAt = new Date(item.expiresAt);
                item.unit = vm.unitById(item.Unit.uuid);
                item.groups = vm.productGroupsByIds(item['ProductGroups']);
            } else {
                item = {
                    name: '',
                    description: '',
                    amount: 1,
                    minAmount: 1,
                    arrivedAt: new Date(),
                    expiresAt: new Date(),
                    unit: vm.units()[0],
                    groups: []
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

            if (type === 'remove') {
                ajaxParam = vm.modalSettings.item.uuid;
            }

            productService[type](ajaxParam)
                .then(function () {
                    if (type === 'remove') {
                        angular.element('[data-id="' + vm.modalSettings.item.uuid + '"').remove();
                    }
                    angular.element(modalElement).modal('hide');
                });
        }

        /**
        * filter product list by tag
        * @param {String} tag - tag name (in this case - product group)
        */
        function filterByTag (tag) {
            vm.activeTag = tag;
        }
    }

})();
