(function() {
    'use strict';
    angular.module('feed').controller('ChartsDemoController', ChartsDemoController);

    function ChartsDemoController($scope, feedFactory, $stateParams, _) {
        var vm = this;
        vm.feeds = ['fake'];
        feedFactory.chartsDemoFeeds().then(function(data) {
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
})();