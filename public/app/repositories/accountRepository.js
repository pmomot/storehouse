/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Repositories')
        .factory('accountRepository', accountRepository);

    accountRepository.$inject = ['$http', '$q'];

    /**
     * Account Repository
     * */
    function accountRepository($http, $q) {

        /**
         * Log in user to portal
         * */
        function login(params) {
            var deferred = $q.defer();

            $http.post('/api/user/log-in', params)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Create new user
         * */
        function signUp(params) {
            var deferred = $q.defer();

            $http.post('/api/user', params)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }


        /**
         *restore user password
         * */

        function restorePassword(params) {
            var deferred = $q.defer();
            
            $http.post('/api/user/forgot-password', params)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Change user password
         * */
        function changePass(params) {
            var deferred = $q.defer();

            $http.put('/api/user/change-pass', params)
                .then(function (result) {
                    if (result.data.success) {
                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.data);
                    }
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Get user data form api
         * */
        function loadUserInfo() {
            var deferred = $q.defer();

            $http.get('/api/user')
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        /**
         * Get users list form api
         * */
        function fetchUsers() {
            var deferred = $q.defer();

            $http.get('/api/users')
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        return {
            login: login,
            signUp: signUp,
            changePass: changePass,
            loadUserInfo: loadUserInfo,
            fetchUsers: fetchUsers,
            restorePassword: restorePassword
        };
    }

})();
