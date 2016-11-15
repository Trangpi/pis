(function() {
    'use strict';

    angular
        .module('pisApp')
        .controller('PostController', PostController);

    PostController.$inject = ['$scope', 'Principal', 'LoginService', '$state','$http'];

    function PostController ($scope, Principal, LoginService, $state,$http) {
        var vm = this;

        vm.account = null;
        vm.entry=null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.btnPostClick = btnPostClick;
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
        function getBase64(file, callback) {//chuyen tu file sang base64
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                callback(reader.result);
            }
            reader.onerror = function(err) {
                console.log(err);
            }
        }
        var imageBase64 = ""; // String base64 of image
        document.getElementById('image').onchange = function(e){
            var file = e.target.files[0]; // Get file when input change
            getBase64(file, function(str){
//                console.log(str.length);
//                console.log(str.substr(1, 100));
//                document.getElementById('img').src = str;
                  imageBase64 = str;
            });
        }

        function btnDeleteClick(e) {
            var postid = e.target.attributes.postid;
            deleteRequest('/api/entries/' + postid, function(data){
                console.log('OK');
                e.target.parentNode.remove();
            });
        }

        function btnPostClick() {
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
                        "title": title,
                        "image": imageBase64
                    }
                    console.log(postContent);
                    postJson('/api/entries', postContent, function(data){
                         //console.log(data);
                         // alert("OK");
//                         var str = '<div class="well">' +
//                             '<h3>'+ title + '</h3>' +
//                             '<h6>' + date + '</h6>' +
//                             '<hr>' +
//                             '<p>' + content + '</p>';
//                          if (imageBase64) {
//                            str += '<img class="img" src = "' + imageBase64 + '">';
//                          }
//                          str += '</div>';
                          var div = document.createElement('div');
                          div.classList.add("well");
                          var h3=document.createElement('h3');
                          h3.innerHTML=title;
                          var h6=document.createElement('h6');
                          h6.innerHTML=date;
                          var hr=document.createElement('hr');
                          var p=document.createElement('p');
                          p.innerHTML=content;
                          var img = null;
                          if (imageBase64) {
                            img = document.createElement('img');
                            img.src = imageBase64;
                            img.classList.add('img');
                          }
                          var btn = document.createElement('button');
                          btn.classList.add('btn');
                          btn.classList.add('btn-danger');
                          btn.innerHTML = "Delete post";
                          btn.onclick = btnDeleteClick;
                          btn.attributes.postid = data.id;
                          div.appendChild(h3);
                          div.appendChild(h6);
                          div.appendChild(hr);
                          div.appendChild(p);
                          if (img) {
                            div.appendChild(img);
                          }
                          div.appendChild(btn);

//                         document.getElementById('postContent').innerHTML = str +
//                         document.getElementById('postContent').innerHTML;
                         document.getElementById('postContent').prepend(div);
                         document.getElementById('titleContent').value = '';
                         document.getElementById('textContent').value = '';
                         document.getElementById('image').value = null;
                         //imageBase64 = null;
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

        function deleteRequest(url, callback) {
            var request = new XMLHttpRequest();
            request.open('DELETE', url, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    callback(request.responseText);
                }
                else {
                    callback(null);
                }
            }
            request.send();
        }



        var postContent = document.getElementById('postContent');
        postContent.innerHTML = '';
        $.get('/api/account', function(account){
            if (account.login){
                $.get('/api/entries?size=1000', function(data){
                    //var str = "";
                    var div = null;
                    console.log(data);
                    data.forEach(function(entry){
                        if (entry.users.login === account.login) {
                            div = document.createElement("div");
                            div.classList.add("well");
                            var h3 = document.createElement('h3');
                            h3.innerHTML = entry.title;
                            var h6 = document.createElement('h6');
                            h6.innerHTML = entry.date;
                            var hr=document.createElement('hr');
                            var p=document.createElement('p');
                            p.innerHTML = entry.content;

                            div.appendChild(h3);
                            div.appendChild(h6);
                            div.appendChild(hr);
                            div.appendChild(p);

                            if (entry.image) {
                                var img = document.createElement('img');
                                img.src = entry.image;
                                img.classList.add('img');
                                div.appendChild(img);
                            }
                            var btnDelete = document.createElement('button');
                            btnDelete.classList.add("btn");
                            btnDelete.classList.add("btn-danger");
                            btnDelete.attributes['postid'] = entry.id;
                            btnDelete.innerHTML = "Delete post";
                            btnDelete.onclick = btnDeleteClick;
                            div.appendChild(btnDelete);
//                            str = '<div class="well">' +
//                                '<h3>'+ entry.title + '</h3>' +
//                                '<h6>' + entry.date + '</h6>' +
//                                '<hr>' +
//                                '<p>' + entry.content + '</p>' +
//                            "</div>" + str;
                        }
                        if (div) {
                            postContent.prepend(div);
                        }
                    });
                });
            }
        });
    }
})();
