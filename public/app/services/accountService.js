/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('accountService', accountService);

    accountService.$inject = ['$q', '$window', 'accountRepository', 'toastr'];

    /**
     * Accounts processing service
     * */
    function accountService($q, $window, accountRepository, toastr) {
        var userInfo = {}, users = [];

        if (!$window.localStorage.getItem('token')) {
            $window.localStorage.setItem('token', '');
        }

        /**
         * Log in user to portal
         * */
        function login(email, password) {
            var deferred = $q.defer();

            accountRepository.login({
                email: email,
                password: password
            })
                .then(function (data) {
                    $window.localStorage.setItem('token', data.token);
                    userInfo = data.user;

                    toastr.success(data.message);
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Create new user
         * */
        function signUp(requestData) {
            var deferred = $q.defer();

            accountRepository.signUp(requestData)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Change user password
         * */
        function changePass(requestData) {
            var deferred = $q.defer();

            requestData.email = userInfo.email;

            accountRepository.changePass(requestData)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                })
                .catch(function (error) {
                    toastr.error(error.message);
                    deferred.reject();
                });

            return deferred.promise;
        }

        /**
         * restore user password
         * */
        function restorePassword(requestData) {
            var deferred = $q.defer();
            accountRepository.restorePassword(requestData)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                })
                .catch(function (error) {
                    toastr.error(error.message);
                    deferred.reject();
                });

            return deferred.promise;
        }

        /**
         * Get user data form api
         * */
        function loadUserInfo() {
            var deferred = $q.defer();

            if ($window.localStorage.getItem('token') === '') {
                toastr.error('User is not logged in');
                return $q.reject({});
            }

            accountRepository.loadUserInfo()
                .then(function (data) {
                    userInfo = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Get users list form api
         * */
        function fetchUsers() {
            var deferred = $q.defer();

            accountRepository.fetchUsers()
                .then(function (data) {
                    users = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        // service calls
        /**
         * Log out of portal
         * */
        function logout() {
            $window.localStorage.setItem('token', '');
        }

        /**
         * Get current account info
         * */
        function getUsers() {
            return users;
        }

        /**
         * Get current account info
         * */
        function getUserInfo() {
            return userInfo;
        }

        /**
         * Verify that service has user info saved
         * */
        function hasUserInfo() {
            return Object.keys(userInfo).length > 0;
        }

        return {
            // api calls
            login: login,
            signUp: signUp,
            loadUserInfo: loadUserInfo,
            fetchUsers: fetchUsers,

            restorePassword: restorePassword,

            changePass: changePass,

            // service calls
            logout: logout,
            getUserInfo: getUserInfo,
            getUsers: getUsers,
            hasUserInfo: hasUserInfo
        };
    }

})();
