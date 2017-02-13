(function() {
    'use strict';
    angular.module('feed').controller('ChartsController', ChartsController);

    function ChartsController($scope, feedFactory, $stateParams, _) {
        var vm = this;
        function updateCharts() {

            if (!vm.feeds || !vm.feeds.length) {
                return;
            }

            feedFactory.chartsFeeds(vm.feeds).then(function(data) {
                Highcharts.chart('container', {
                    legend: {
                        itemStyle: {
                            fontWeight: '500'
                        },
                        itemDistance: 40,
                        itemMarginBottom: 10,
                    },
                    chart: {
                        type: 'spline'
                    },
                    title: false,
                    plotOptions: {
                        spline: {
                            lineWidth: 4,
                            states: {
                                hover: {
                                    lineWidth: 5
                                }
                            },
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: false
                    },
                    series: data.chartSeries
                });
            });
        }   

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.charts') {
                vm.feeds = _.filter(params.feeds.split(':'), Boolean);
                updateCharts();
            }
        });
    }
})();