/**
 * Created by pmomot on 4/14/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shList', listDirective);

    listDirective.$inject = [];

    /**
     * List Directive
     * */
    function listDirective () {
        return {
            restrict: 'E',
            templateUrl: 'app/directives/listView.html',
            link: link,
            replace: true,
            scope: {
                settings: '='
            }
        };

        /**
         * Link function
         * */
        function link (scope) {
            console.log(scope);
            console.log(scope.settings);
        }
    }
})();
