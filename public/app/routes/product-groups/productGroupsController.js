/**
 * Created by pmomot on 4/15/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('ProductGroupsController', ProductGroupsController);

    ProductGroupsController.$inject = ['productGroupService', 'MODAL_BUTTONS'];

    /**
     * Product Groups Controller
     * */
    function ProductGroupsController (productGroupService, MODAL_BUTTONS) {
        var vm = this;

        vm.modalShow = false;

        vm.listSettings = {
            addNewLabel: 'Add new product group',
            emptyLabel: 'There are no product groups in storehouse yet :(',
            showPopup: showPopup,
            list: productGroupService.getGroups,
            header: ['Name', 'Description'],
            fields: ['name', 'description']
        };

        productGroupService.fetch();

        /**
         * Show create/update/remove popup for product group
         * @param {String} type - popup type
         * @param {Object} g - group
         * */
        function showPopup (type, g) {
            var submitButton = type === 'remove' ? MODAL_BUTTONS.REMOVE : MODAL_BUTTONS.SUBMIT;

            if (g) {
                g = JSON.parse(JSON.stringify(g));
            } else {
                g = {
                    name: '',
                    description: ''
                };
            }

            vm.modalType = type;
            vm.modalTitle = 'Product Group ' + type;
            vm.modalItem = g;

            vm.modalButtonsOptions = {
                cancelButton: MODAL_BUTTONS.CANCEL,
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
            var ajaxParam = vm.modalItem,
                actionCallback = function () {
                    vm.modalShow = false;
                };

            if (type === 'remove') {
                vm.modalShow = false;
                ajaxParam = vm.modalItem.uuid;

                actionCallback = function () {
                    angular.element('[data-id="' + vm.modalItem.uuid + '"').remove();
                };
            }

            productGroupService[type](ajaxParam) // call remove, update or create method
                .then(actionCallback);
        }
    }

})();
