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
         * Remove product group by id
         * @param {String} id - product group id
         * */
        function remove (id) {
            var deferred = $q.defer();

            productGroupRepository.remove(id)
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

        /**
         * Get product groups from list by ids
         * */
        function getGroupsByIds (groupsList) {
            var i, id, g, toReturn = [];

            for (i = 0; i < groupsList.length; i += 1) {
                id = groupsList[i].uuid;

                for (g = 0; g < groups.length; g += 1) {
                    if (groups[i].uuid === id) {
                        toReturn.push(groups[i]);
                        break;
                    }
                }
            }

            return toReturn;
        }

        return {
            fetch: fetch,
            create: create,
            remove: remove,
            update: update,

            getGroups: getGroups,
            getGroupsByIds: getGroupsByIds
        };
    }
})();
