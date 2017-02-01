(function() {
    'use strict';
    angular.module('prokorm').controller('ProfileViewController', ProfileViewController);
    /** @ngInject */
    function ProfileViewController($scope, $state, $mdDialog, loginFactory) {
        var vm = this;
        loginFactory.getProfileView().then(function(result) {
            vm.userInfo = result.controls;
            vm.companyUsers = result.companyUsers;
        });
        vm.edit = function() {
            $state.go('farm.instance.profile.edit');
        };
        vm.changePassword = function(ev) {
            $mdDialog.show({
                controller: ChangePasswordController,
                templateUrl: './app/profile/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            }).then(function(answer) {
                $state.go('farm.instance.profile.view');
            }, function() {
                $state.go('farm.instance.profile.view');
            });
        };

        vm.addUser = function () {
            $state.go('farm.instance.profile.addUser');        
        };
    }
    angular.module('prokorm').controller('ProfileEditController', ProfileEditController);
    /** @ngInject */
    function ProfileEditController($scope, $state, loginFactory) {
        var vm = this;
        loginFactory.getProfileEdit().then(function(result) {
            vm.userInfo = result.controls;
            vm.profile = result.profile;
        });
        vm.save = function() {
            loginFactory.updateProfile(vm.profile).then(function(result) {
                if (result.message === 'OK') {
                    $state.go('farm.instance.profile.view');
                }
            });
        };
        vm.cancel = function () {
            $state.go('farm.instance.profile.view');
        }
    }
    angular.module('prokorm').controller('AddUserController', AddUserController);
    /** @ngInject */
    function AddUserController($scope, $state, loginFactory) {
        var vm = this;
        vm.user = {
            name: '',
            fullName: '',
            email: '',
            password: '',
            tenantFullName: ''
        };
        vm.cancel = function() {
            $state.go('farm.instance.profile.view');
        };
        vm.save2 = function() {
            if (vm.user.password === vm.password_2) {
                var permissions = [];
                if (vm.allowRead){
                    permissions.push('read');
                }
                if (vm.allowWrite){
                    permissions.push('write');
                }
                var user = _.extend(vm.user, {
                    permissions: permissions
                });
                loginFactory.addUser(user).then(function(result) {
                    if (result.message === 'OK') {
                        $state.go('farm.instance.profile.view');
                    }
                });
            }
        };
    }
    angular.module('prokorm').controller('ChangePasswordController', ChangePasswordController);
    /** @ngInject */
    function ChangePasswordController($scope, $mdDialog, loginFactory) {
        
        $scope.currentPassword = '';
        $scope.newPassword = '';
        $scope.newPassword2 = '';

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function () {
            loginFactory.setPassword({
                currentPassword: $scope.currentPassword,
                newPassword: $scope.newPassword,
                newPassword2: $scope.newPassword2
            }).then(function (data) {
                if (data.message === 'OK') {
                    $state.go('farm.instance.profile.view');
                }
            });
        };
    }
})();