/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['unitService'];

    /**
     * Units Controller
     * */
    function UnitsController (unitService) {
        var vm = this;

        vm.modalShow = false;
        vm.modalTitle = 'Unit form';

        vm.listSettings = {
            addNewLabel: 'Add new unit of measurement',
            emptyLabel: 'There are no units of measurement in storehouse yet :(',
            showPopup: showPopup,
            list: unitService.getUnits,
            header: ['Name', 'Description'],
            fields: ['name', 'description']
        };

        unitService.fetchUnits();

        /**
         * Show create/update/remove popup for unit
         * @param {String} type - popup type
         * @param {Object} p - unit
         * */
        function showPopup (type, p) {
            var submitButton;

            if (p) {
                p = JSON.parse(JSON.stringify(p));
            } else {
                p = {
                    name: '',
                    description: ''
                };
            }

            vm.modalType = type;
            vm.modalTitle = 'Unit ' + type;
            vm.modalItem = p;

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
                    unitService
                        .deleteUnit(vm.modalItem.uuid)
                        .then(function () {
                            angular.element('[data-id="' + vm.modalItem.uuid + '"').remove();
                        });
                    break;
                case 'update':
                    unitService.updateUnit(vm.modalItem);
                    break;
                case 'create':
                    unitService.createUnit(vm.modalItem);
                    break;
            }
        }
    }

})();
