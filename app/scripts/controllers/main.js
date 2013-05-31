'use strict';
var Parse = Parse;
var _ = _;

var m = angular.module('regexFiddleApp');
m.config(function(){
    Parse.initialize('eGZU1xz0zEJydpmz67LOZYKYo5VTVXgeQHJfRpjs', 'pJNzuPYF4vOqBVxgKvqpn257d7uXyy3eV9DjmMNK');
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
            return [];
        }

        var data = $scope.regex.attributes.data.split('\n');
        if (!$scope.regex.attributes.regex) {
            return data;
        }
        var replace = $scope.regex.attributes.replace || '<span class="matched">$1</span>';

        for (var i = 0; i < data.length; i++) {
            data[i] = data[i].replace(new RegExp('(' + $scope.regex.attributes.regex + ')', $scope.regex.attributes.flags), replace).replace(/\n/g, '<br>');
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
