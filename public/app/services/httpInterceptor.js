/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('httpInterceptor', httpInterceptor);

    httpInterceptor.$inject = ['$rootScope', '$q', '$window', 'toastr'];

    /**
     * Service intercepts all api requests and responses
     * */
    function httpInterceptor ($rootScope, $q, $window, toastr) {

        /**
         * Fires every time response is coming
         * */
        function responseCallback (payload) {
            var message = 'Something went wrong';

            if (typeof payload === 'object' && payload.data && payload.data.success === false) {
                if (payload.message) {
                    message = payload.message;
                } else if (payload.data) {
                    if (typeof payload.data === 'string') {
                        message = payload.data;
                    } else if (payload.data.message) {
                        message = payload.data.message;
                    }
                }
                toastr.error(message);
            }
            $rootScope.processing = false;
        }

        return {
            request: function (config) {
                config.headers['x-access-token'] = $window.localStorage.getItem('token');
                $rootScope.processing = true;

                return config;
            },

            response: function (response) {
                responseCallback(response);

                return response;
            },

            responseError: function (rejection) {
                responseCallback(rejection);

                if (rejection.status === 403) {
                    $window.localStorage.setItem('token', '');
                }

                return $q.reject(rejection);
            }
        };
    }
})();
