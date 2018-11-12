(function() {
    'use strict';
    FeedViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'feedFactory', '_']
    angular.module('feed').controller('FeedViewController', FeedViewController);

    function FeedViewController($mdDialog, $stateParams, $state, authFactory, feedFactory, _) {
        var vm = this;
        vm._ = _;
        var feedId = $stateParams.feedId;
        if (!feedId) {
            return;
        }
        vm.isDrySwitch = true;
        vm.print = function() {
            
            authFactory.getSessionData().then(function(data) {

                var analysisPrint = document.getElementById('analysis');
                var generalPrint = document.getElementById('general');
                var harvestPrint = document.getElementById('harvest');
                var feedingPrint = document.getElementById('feeding');

                var popupWin = window.open('', '_blank');
                popupWin.document.open();
                popupWin.document.write(
                    '<html style="background-color: #fff;">'+
                        '<title>AGRODESK:печать</title>'+
                        '<head>'+
                            '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                            '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                        '</head>'+
                        '<body onload="setTimeout(function() {window.print(); window.close();}, 500)" class="feed print">' + 
                            (analysisPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + 
                                '</h2><label class="key">анализы:  </label>' + vm.feed.name + '&nbsp;&nbsp;&nbsp;' + vm.feed.year + '&nbsp;&nbsp;&nbsp;' +  vm.feed.storage + '</div>' +
                                '<br/>' +
                                analysisPrint.innerHTML + 
                                '<div class="break"></div>') : ''
                            ) +
                            (generalPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">основные:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                generalPrint.innerHTML + 
                                '<br/>') : ''
                            ) +
                            (harvestPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">заготовка:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                harvestPrint.innerHTML + 
                                '<br/>') : '' 
                            ) +
                            (feedingPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">кормление:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                feedingPrint.innerHTML) : ''
                            ) + 
                        '</body>'+
                        '<footer>prokorm.com</footer>' +
                    '</html>');
                popupWin.document.close();
                //popupWin.onfocus=function(){ popupWin.close();}

            });
        };
        vm.edit = function() {
            $state.go('tenant.feed.edit', {
                'feedId': feedId
            });
        };
        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Удаление')
                .textContent('Вы хотите удалить корм ' + vm.feed.name + ' ?')
                .targetEvent(ev).ok('Да').cancel('Отменить');
            $mdDialog.show(confirm).then(function() {
                feedFactory.deleteFeed($stateParams.feedId).then(function(res) {
                    $state.go('tenant.feed');
                });
            }, function() {});
        };
        feedFactory.getFeedView(feedId).then(function(feedView) {
            vm.feed = feedView.general;
            vm.feedItemSections = feedView.feedItemSections;
            vm.actions = feedView.actions;
        });
    }
})();