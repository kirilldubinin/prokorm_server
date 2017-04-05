(function() {
    'use strict';
    angular.module('prokorm').controller('ProfileViewController', ProfileViewController);
    /** @ngInject */
    function ProfileViewController($scope, $state, $mdDialog, authFactory) {
        var vm = this;
        authFactory.getProfileView().then(function(result) {
            vm.userInfo = result.userInfo;
            vm.companyUsers = result.companyUsers;
            vm.companyLicense = result.companyLicense;
            vm.admin = result.admin;
        });
        vm.edit = function() {
            $state.go('tenant.profile.edit');
        };
        vm.changePassword = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            $mdDialog.show({
                controller: ChangePasswordController,
                templateUrl: './app/profile/changePassword/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                escapeToClose: false,
                backdrop : 'static'
            });
        };

        vm.addUser = function () {
            $state.go('tenant.profile.addUser');        
        };
    }
    angular.module('prokorm').controller('ProfileEditController', ProfileEditController);
    /** @ngInject */
    function ProfileEditController($scope, $state, authFactory) {
        var vm = this;
        authFactory.getProfileEdit().then(function(result) {
            vm.userInfo = result.controls;
            vm.profile = result.profile;
        });
        vm.save = function() {
            authFactory.updateProfile(vm.profile).then(function(result) {
                if (result.message === 'OK') {
                    $state.go('tenant.profile.view');
                }
            });
        };
        vm.cancel = function () {
            $state.go('tenant.profile.view');
        };
    }
    angular.module('prokorm').controller('AddUserController', AddUserController);
    /** @ngInject */
    function AddUserController($scope, $state, authFactory) {
        var vm = this;
        vm.user = {
            name: '',
            fullName: '',
            email: '',
            password: '',
            tenantFullName: ''
        };
        vm.cancel = function() {
            $state.go('tenant.profile.view');
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
                authFactory.addUser(user).then(function(result) {
                    if (result.message === 'OK') {
                        $state.go('tenant.profile.view');
                    }
                });
            }
        };
    }
    angular.module('prokorm').controller('ChangePasswordController', ChangePasswordController);
    /** @ngInject */
    function ChangePasswordController($scope, $state, $mdDialog, authFactory) {
        
        $scope.currentPassword = '';
        $scope.newPassword = '';
        $scope.newPassword2 = '';

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function () {
            $scope.error = null;
            authFactory.setPassword({
                currentPassword: $scope.currentPassword,
                newPassword: $scope.newPassword,
                newPassword2: $scope.newPassword2
            }).then(function (data) {
                if (data.message === 'OK') {
                    $mdDialog.show(
                        $mdDialog
                        .alert()
                        .clickOutsideToClose(false)
                        .title('Смена пароля')
                        .textContent('Новый пароль сохранен')
                        .ok('Ok')
                    );
                } else {
                    $scope.error = data.message;
                }
            }, function () {
                return false;
            });
        };
    }
})();