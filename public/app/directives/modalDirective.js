/**
 * Created by pmomot on 4/7/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shModal', modal);

    modal.$inject = ['productService'];
    // TODO SH rewrite this, and update all corresponding controllers

    /**
     * General Modal Directive
     * */
    function modal () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/modalView.html',
            transclude: true,
            replace: true,
            scope: true,
            link: function (scope, element, attrs) {
                var sizeClass = '';

                switch (attrs.size) {
                    case 'large':
                        sizeClass = 'modal-lg';
                        break;
                    case 'small':
                        sizeClass = 'modal-sm';
                        break;
                }

                scope.size = getSizeClass;
                scope.submit = submit;
                scope.close = close;

                scope.$watch(attrs.visible, function (value) {
                    angular.element(element).modal(value === true ? 'show' : 'hide');
                });

                scope.$watch(attrs.title, function (value) {
                    scope.title = value;
                });

                scope.$watch(attrs.footer, function (value) {
                    if (typeof value !== 'undefined') {
                        scope.submitButton = value.submitButton || null;
                        scope.cancelButton = value.cancelButton;
                        scope.callback = value.callback;
                    }
                });

                scope.$watch(attrs.model, function (value) {
                    scope.model = value;
                });

                scope.$watch(attrs.type, function (value) {
                    scope.type = value;
                });

                angular.element(element).on('hidden.bs.modal', function () {
                    scope.$apply(close);
                });

                /**
                 * Get up to date modal size class
                 * */
                function getSizeClass () {
                    return sizeClass;
                }

                /**
                 * Form submit event callback
                 * */
                function submit () {
                    // TODO SH add validation here
                    // TODO SH on iphone required not working

                    close();
                    if (typeof scope.callback === 'function') {
                        scope.callback(scope.type);
                    }
                }

                /**
                 * Close popup, do nothing
                 * */
                function close () {
                    scope.$parent.vm.modalShow = false;
                }
            }
        };
    }
})();
