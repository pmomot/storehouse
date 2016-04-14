/**
 * Created by pmomot on 4/14/16.
 */
'use strict';

(function () {
    angular
        .module('StoreHouse.Services')
        .factory('productGroupService', productGroupService);

    productGroupService.$inject = ['$q', 'productGroupRepository', 'toastr'];

    /**
     * Product groups processing service
     * */
    function productGroupService ($q, productGroupRepository, toastr) {
        var groups = [];

        /**
         * Get groups list from server
         * */
        function fetch () {
            var deferred = $q.defer();

            productGroupRepository.fetch({})
                .then(function (data) {
                    groups = data;
                    deferred.resolve(data);
                });

            return deferred.promise;
        }

        /**
         * Create product group
         * @param {Object} group - new product group
         * */
        function create (group) {
            var deferred = $q.defer();

            productGroupRepository.create(group)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Delete product group by id
         * @param {String} id - product group id
         * */
        function drop (id) {
            var deferred = $q.defer();

            productGroupRepository.drop(id)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Update product group
         * @param {Object} group - object to update
         * */
        function update (group) {
            var deferred = $q.defer();

            productGroupRepository.update(group)
                .then(function (data) {
                    toastr.success(data.message);
                    deferred.resolve(data);
                    fetch();
                });

            return deferred.promise;
        }

        /**
         * Get stored product groups list
         * */
        function getGroups () {
            return groups;
        }

        return {
            fetch: fetch,
            create: create,
            drop: drop,
            update: update,

            getGroups: getGroups
        };
    }
})();
