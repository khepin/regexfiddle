'use strict';
var Parse = Parse;
var _ = _;

var m = angular.module('regexFiddleApp');
m.config(function(){
    Parse.initialize('92SVaZJHUZ5xeQxFbuGG2pJ330COl23ME1yBneM6', '00YVmhKwZpsLWRvacpxPM00bVBM0LyF1gSuVMJH2');
});

m.controller('MainCtrl', function ($scope, $routeParams) {
    var SavedRegex = Parse.Object.extend('SavedRegex');
    $scope.regex = new SavedRegex();
    if ($routeParams.id) {
        var query = new Parse.Query(SavedRegex);
        query.get($routeParams.id, {
          success: function(response) {
            $scope.regex = response;
            $scope.$apply();
          },
          error: function() {
          }
        });
    }

    $scope.regex.attributes.flags = 'g';
    $scope.regexResult = function() {
        if (!$scope.regex.attributes.data) {
            return ;
        }

        var data = $scope.regex.attributes.data.split('\n');

        var replace = $scope.regex.attributes.replace || '';

        var spanOpen, spanClose;
        if (!$scope.regex.attributes.doReplace) {
            spanOpen = Math.floor(Math.random() * 80000);
            spanClose = Math.floor(Math.random() * 80000);
            replace = spanOpen + '$1' + spanClose;
        }

        for (var i = 0; i < data.length; i++) {
            if ($scope.regex.attributes.regex) {
                var reg = new RegExp('(' + $scope.regex.attributes.regex + ')', $scope.regex.attributes.flags);
                data[i] = data[i].replace(reg, replace);
            }

            data[i] = _.escape(data[i]).replace(/\s/g, '&nbsp;');

            if (spanOpen) {
                data[i] = data[i].replace(new RegExp(spanOpen, 'g'), '<span class="matched">');
                data[i] = data[i].replace(new RegExp(spanClose, 'g'), '</span>');
            }
            data[i] = {line: data[i].replace(/\n/g, '<br>')};
        }
        return data;
    };

    $scope.save = function() {
        $scope.regex.set($scope.regex.attributes);
        $scope.regex.save({
            success: function() {
                $scope.saved = true;
                $scope.$apply();
                _.delay(function() {
                    $scope.saved = false;
                    $scope.$apply();
                }, 2000);
            },
            error: function() {
                $scope.saveError = true;
                $scope.$apply();
                _.delay(function() {
                    $scope.saveError = false;
                    $scope.$apply();
                }, 2000);
            }
        });
    };
});
