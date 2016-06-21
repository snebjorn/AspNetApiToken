var app = angular.module("app", []);

app.controller("AccountCtrl", function ($http) {
    var vm = this;

    vm.callApi = function () {
        var token = sessionStorage.getItem('tokenKey');
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $http({
            method: 'GET',
            url: '/api/values',
            headers: headers
        }).then(function success(response) {
            console.log(response);
            vm.response = response.data;
        }, function fail(error) {
            console.log(error);
        });
    };

    vm.register = function () {
        var data = {
            email: vm.registerEmail,
            password: vm.registerPassword,
            confirmPassword: vm.registerPassword2
        };

        $http({
            method: 'POST',
            url: '/api/Account/Register',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            data: JSON.stringify(data)
        }).then(function success(response) {
            console.log(response);
        }, function fail(error) {
            console.log(error);
        });
    };

    vm.login = function () {
        var loginData = "grant_type=password&username=" + vm.loginEmail + "&password=" + vm.loginPassword;

        $http({
            method: 'POST',
            url: '/Token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: loginData
        }).then(function (response) {
            console.log(response);
            // Cache the access token in session storage.
            sessionStorage.setItem('tokenKey', response.data.access_token);
            vm.username = response.userName;
        }, function fail(error) {
            console.log(error);
        });
    };

    vm.logout = function () {
        sessionStorage.removeItem('tokenKey');
    };

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    vm.getClaimsFromToken = function () {
        var token = sessionStorage.getItem('tokenKey');
        var user = {};
        if (typeof token !== 'undefined') {
            //var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(token));
        }
        console.log(user);
    }
});
