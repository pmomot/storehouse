/**
 * Created by pmomot on 4/15/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ProductGroupsController', ProductGroupsController);

    ProductGroupsController.$inject = ['productGroupService', 'MODAL_SETTINGS', 'MODAL_BUTTONS'];

    /**
     * Product Groups Controller
     * */
    function ProductGroupsController (productGroupService, MODAL_SETTINGS, MODAL_BUTTONS) {
        var vm = this;

        vm.listSettings = {
            addNewLabel: 'Add new product group',
            emptyLabel: 'There are no product groups in storehouse yet :(',
            showPopup: showPopup,
            list: productGroupService.getGroups,
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

        productGroupService.fetch();

        /**
         * Show create/update/remove popup for product group
         * @param {String} type - popup type
         * @param {Object} item - group
         * */
        function showPopup (type, item) {
            var submitButton = type === 'remove' ? MODAL_BUTTONS.REMOVE : MODAL_BUTTONS.SUBMIT;

            if (item) {
                item = JSON.parse(JSON.stringify(item));
            } else {
                item = {
                    name: '',
                    description: ''
                };
            }

            angular.extend(vm.modalSettings, {
                type: type,
                title: 'Product Group ' + type,
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

            productGroupService[type](ajaxParam) // call remove, update or create method
                .then(function () {
                    if (type === 'remove') {
                        angular.element('[data-id="' + vm.modalSettings.item.uuid + '"').remove();
                    }
                    angular.element(modalElement).modal('hide');
                });
        }
    }

})();
