/**
 * Created by pmomot on 4/7/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shModal', modal);

    modal.$inject = ['productService'];

    /**
     * General Modal Directive
     * */
    function modal () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/modalView.html',
            transclude: true,
            replace: true,
            scope: {
                settings: '='
            },
            link: link
        };

        /**
         * Link function
         * */
        function link (scope, element) {
            scope.submit = submit;
            scope.close = close;

            parseSettings(scope.settings);

            angular.element(element).on('hidden.bs.modal', function () {
                scope.$apply(function close () {
                    scope.settings.type = '';
                });
            });

            /**
             * Parse all settings from parameter to local scope
             * @param {Object} s - settings
             * */
            function parseSettings (s) {
                var size = '';

                if (typeof s === 'undefined') {
                    return;
                }

                scope.title = s.title;

                if (typeof s.buttonsOptions !== 'undefined') {
                    scope.submitButton = s.buttonsOptions.submitButton || null;
                    scope.cancelButton = s.buttonsOptions.cancelButton;
                    scope.callback = s.buttonsOptions.callback;
                }

                switch (s.size) {
                    case 'large':
                        size = 'modal-lg';
                        break;
                    case 'small':
                        size = 'modal-sm';
                        break;
                }
                scope.size = size;

                angular.element(element).modal('show');
            }

            /**
             * Form submit event callback
             * */
            function submit () {
                // TODO SH add validation here
                // TODO SH on iphone required not working

                if (typeof scope.callback === 'function') {
                    scope.callback(element);
                }
            }
        }
    }
})();
