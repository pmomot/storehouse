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
        })
        .constant('MODAL_BUTTONS', {
            REMOVE: {
                buttonType: 'submit',
                value: 'Yes',
                class: 'btn-danger'
            },
            SUBMIT: {
                buttonType: 'submit',
                value: 'Submit',
                class: 'btn-primary'
            },
            CANCEL: {
                buttonType: 'button',
                value: 'Cancel',
                class: 'btn-default',
                callback: 'close'
            }
        })
        .constant('MODAL_SETTINGS', {
            item: {},
            type: '',
            title: '',
            size: ''
        });

})();
