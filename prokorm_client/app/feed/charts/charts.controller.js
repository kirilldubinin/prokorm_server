(function() {
    'use strict';
    angular.module('prokorm').controller('ChartsController', ChartsController);

    function ChartsController($scope, feedFactory, $stateParams, _) {
        var vm = this;
        feedFactory.getCharts().then(function(data) {
            
            Highcharts.chart('container', {
                chart: {
                    type: 'spline'
                },
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

                series: data.chartSeries
            });
            return;

            vm.data = [{
                values: data,      //values - represents the array of {x,y} data points
                key: 'Сырая зола', //key  - the name of the series.
                color: '#ff7f0e'
            }];
            vm.options = {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 40,
                        left: 55
                    },
                    x: function(d) {
                        return d.x;
                    },
                    y: function(d) {
                        return d.y;
                    },
                    useInteractiveGuideline: true,
                    dispatch: {
                        stateChange: function(e) {
                            console.log("stateChange");
                        },
                        changeState: function(e) {
                            console.log("changeState");
                        },
                        tooltipShow: function(e) {
                            console.log("tooltipShow");
                        },
                        tooltipHide: function(e) {
                            console.log("tooltipHide");
                        }
                    },
                    xAxis: {
                        axisLabel: 'Год'
                        /*tickFormat: function(d){
                            return d;
                        }*/
                    },

                    yAxis: {
                        
                    }
                },
                title: {
                    enable: false,
                    text: 'График'
                }
            }
        });
    }
})();