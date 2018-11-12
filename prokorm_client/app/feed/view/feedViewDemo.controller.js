(function() {
    'use strict';
    FeedViewDemoController.$inject = ['$stateParams', '$state', 'feedFactory', '_']
    angular.module('feed').controller('FeedViewDemoController', FeedViewDemoController);

    function FeedViewDemoController($stateParams, $state, feedFactory, _) {
        var vm = this;
        vm._ = _;
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
                        '<title><b>AGRO</b>DESK:печать</title>'+
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
        feedFactory.getFeedViewDemo().then(function(feedView) {
            vm.feed = feedView.general;
            vm.feedItemSections = feedView.feedItemSections;
            vm.actions = feedView.actions;
        });
    }
})();