/**
 * Created by pmomot on 3/30/16.
 */
'use strict';

(function () {

    angular
        .module('StoreHouse.Constants')
        .constant('REGEX', {
            'NAME': /^[a-zA-Z\s]+$/,
            'EMAIL': /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
            'PASS': /^\S{7,}$/
        });

})();
