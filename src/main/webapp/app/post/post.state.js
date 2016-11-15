(function() {
    'use strict';

    angular
        .module('pisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('post', {
            parent: 'app',
            url: '/post',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/post/post.html',
                    controller: 'PostController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('post');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
