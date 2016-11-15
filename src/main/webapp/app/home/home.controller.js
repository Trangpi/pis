(function() {
    'use strict';

    angular
        .module('pisApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state'];

    function HomeController ($scope, Principal, LoginService, $state) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }
        function homepost(){
            var title = document.getElementById('titleContent').value;
            var content = document.getElementById('textContent').value;
            var date = (new Date()).toISOString();
            $.get('/api/account', function(account){
                $.get('/api/users/' + account.login, function(user) {
                    //console.log(user);
                    var postContent = {
                        "users" : {
                            "id" : user.id
                        },
                        "content" : content,
                        "date": date,
                        "title": title
                    }
                    //console.log(postContent);
                    postJson('/api/entries', postContent, function(data){
                         //console.log(data);
                         // alert("OK");
                         var str = '<div class="well">' +
                             '<h3>'+ title + '</h3>' +
                             '<h6>' + date + '</h6>' +
                             '<hr>' +
                             '<p>' + content + '</p>' +
                         "</div>";
                         document.getElementById('postContent').innerHTML = str +
                            document.getElementById('postContent').innerHTML;
                    });
                });
            });
        }

        function postJson(url, data, callback) {
                	var request = new XMLHttpRequest();
                	request.open('POST', url, true);
                	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                	request.onload = function() {
                		if (request.status >= 200 && request.status < 400) {
                			callback(JSON.parse(request.responseText));
                		}
                		else {
                			callback(null);
                		}
                	}
                	request.send(JSON.stringify(data));
                }

        function getJson(url, callback) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    callback(JSON.parse(request.responseText));
                }
                else {
                    callback(null);
                }
            }
            request.send();
        }
//        $.get('/api/account', function(account){ // Home thi khong can cai nay, vi ai cung xem duoc, ko can dang nhap
//            if (account.login){
                $.get('/api/entries', function(data){
                    var str = "";
                    data.forEach(function(entry) {
                            var tmp = '<div class="well llew">' +
                                '<h3>'+ entry.title + '</h3>' +
                                '<h6>' + entry.date + '</h6>' +
                                '<hr>' +
                                '<p>' + entry.content + '</p>';
                            if (entry.image) {
                                tmp += '<img src="'+ entry.image +'" class="img">';
                            }
                            tmp += '<h6>';
                            if (entry.users.firstName) {
                                tmp += entry.users.firstName;
                            }
                            if (entry.users.lastName) {
                                tmp += ' ' + entry.users.lastName;
                            }
                            if (!entry.users.firstName && !entry.users.lastName) {
                                tmp += entry.users.login;
                            }
                            tmp = tmp + "</h6></div>";
                            str = tmp + str;
                    });
                    document.getElementById('postContent').innerHTML = str;
                });
//            }
//        });
    }
})();
