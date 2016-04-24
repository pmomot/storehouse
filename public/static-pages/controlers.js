/**
 * Created by bodynP on 20.04.2016.
 */
/**
 * function for processing new password
 * */
function changeForgotPassword () {
    var vm = this,
        newPass = document.getElementById('newPass'),
        retypePass = document.getElementById('retypePass'),
        xhttp = new XMLHttpRequest(),
        loc = window.location;

    vm.errors = [];
    vm.data = {
        newPassword: newPass.value,
        repeatPassword: retypePass.value
    };
    if ((vm.data.newPassword === vm.data.repeatPassword) && (vm.data.newPassword !== '') && (vm.data.repeatPassword !== '')) {
        if (vm.data.newPassword.length > 6) {
            xhttp.open('POST', loc.pathname, true);
            xhttp.setRequestHeader('data', vm.data.newPassword); // new password send in header for the key - data
            xhttp.setRequestHeader('token', window.location.search.slice(7)); // and send verify token for define user
            xhttp.send();
            window.location.assign('http://' + window.location.host + '/'); // go to log-in form
        } else {
            alert('password must be 6 characters long.');
        }
    } else {
        alert('New passwords do not match.');
    }
}