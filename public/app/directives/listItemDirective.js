/**
 * Created by pmomot on 4/29/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Directives')
        .directive('shListItem', listItemDirective);

    listItemDirective.$inject = [];

    /**
     * List Item Directive
     * */
    function listItemDirective () {
        return {
            restrict: 'EA',
            templateUrl: 'app/directives/listItemView.html',
            link: link,
            replace: true,
            scope: {
                settings: '=',
                activeTag: '=',
                item: '='
            }
        };

        /**
         * Link function
         * */
        function link (scope, el, attrs) {
            scope.className = '';

            scope.$watch(attrs.activeTag, function (val) {
                if (scope.settings.type === 'products') {
                    if (val === 'All' || scope.item.groupsNames.indexOf(val) !== -1) {
                        scope.className = '';
                    } else {
                        scope.className = 'hidden';
                    }
                }
            });
        }
    }
})();
