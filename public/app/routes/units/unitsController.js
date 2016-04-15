/**
 * Created by pmomot on 4/13/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse')
        .controller('UnitsController', UnitsController);

    UnitsController.$inject = ['unitService', 'MODAL_SETTINGS', 'MODAL_BUTTONS'];

    /**
     * Units Controller
     * */
    function UnitsController (unitService, MODAL_SETTINGS, MODAL_BUTTONS) {
        var vm = this;

        vm.listSettings = {
            addNewLabel: 'Add new unit of measurement',
            emptyLabel: 'There are no units of measurement in storehouse yet :(',
            showPopup: showPopup,
            list: unitService.getUnits,
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

        unitService.fetch();

        /**
         * Show create/update/remove popup for unit
         * @param {String} type - popup type
         * @param {Object} item - unit
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
                title: 'Unit ' + type,
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

            unitService[type](ajaxParam) // call remove, update or create method
                .then(function () {
                    if (type === 'remove') {
                        angular.element('[data-id="' + vm.modalSettings.item.uuid + '"').remove();
                    }
                    angular.element(modalElement).modal('hide');
                });
        }
    }

})();
