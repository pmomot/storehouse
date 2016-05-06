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
    function accountService ($q, $window, accountRepository, toastr) {
        var userInfo = {}, users = [], locale = {};

        if (!$window.localStorage.getItem('token')) {
            $window.localStorage.setItem('token', '');
        }

        /**
         * Log in user to portal
         * */
        function login (email, password) {
            var deferred = $q.defer();

            accountRepository.login({
                email: email,
                password: password
            })
                .then(function (data) {
                    $window.localStorage.setItem('token', data.token);
                    userInfo = data.user;
                    processUserInfo();

                    toastr.success(data.message);
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Create new user
         * */
        function signUp (requestData) {
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
        function changePass (requestData) {
            var deferred = $q.defer();

            requestData.email = userInfo.email;

            accountRepository.changePass(requestData)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Get user data form api
         * */
        function loadUserInfo () {
            var deferred = $q.defer();

            if ($window.localStorage.getItem('token') === '') {
                toastr.error('User is not logged in');
                return $q.reject({});
            }

            accountRepository.loadUserInfo()
                .then(function (data) {
                    userInfo = data;
                    processUserInfo();
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Get users list form api
         * */
        function fetchUsers () {
            var deferred = $q.defer();

            accountRepository.fetchUsers()
                .then(function (data) {
                    users = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Get localization info on app start
         * */
        function fetchLocale () {
            var deferred = $q.defer();

            if (!window.localStorage.getItem('lang')) {
                window.localStorage.setItem('lang', 'en');
            }

            accountRepository.fetchLocale(window.localStorage.getItem('lang'))
                .then(function (data) {
                    userInfo.locale = data;
                    processUserInfo();
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Change user language
         * @param {String} language - new user language
         * */
        function changeLanguage (language) {
            var deferred = $q.defer();

            accountRepository.changeLanguage(language)
                .then(function (data) {
                    toastr.success(data.message);

                    userInfo.lang = language;
                    userInfo.locale = data.locale;
                    processUserInfo();

                    deferred.resolve(data);
                })
                .catch(function () {
                    deferred.reject();
                });

            return deferred.promise;
        }

        // service calls
        /**
         * Log out of portal
         * */
        function logout () {
            $window.localStorage.setItem('token', '');
        }

        /**
         * Get current account info
         * */
        function getUsers () {
            return users;
        }

        /**
         * Get current account info
         * */
        function getUserInfo () {
            return userInfo;
        }

        /**
         * Verify that service has user info saved
         * */
        function hasUserInfo () {
            return Object.keys(userInfo).length > 0;
        }

        /**
        * Get localization object
        */
        function getLocalization () {
            return locale;
        }

        // helpers

        /**
         * Convert collection of objects into object
         * */
        function processUserInfo () {
            var i, L = userInfo.locale;

            window.localStorage.setItem('lang', userInfo.lang);

            locale = {};
            for (i = 0; i < L.length; i += 1) {
                locale[L[i].key] = L[i].value;
            }
        }

        return {
            // api calls
            login: login,
            signUp: signUp,
            loadUserInfo: loadUserInfo,
            fetchUsers: fetchUsers,
            fetchLocale: fetchLocale,
            changeLanguage: changeLanguage,

            changePass: changePass,

            // service calls
            logout: logout,
            getUserInfo: getUserInfo,
            getUsers: getUsers,
            hasUserInfo: hasUserInfo,
            getLocalization: getLocalization
        };
    }

})();
