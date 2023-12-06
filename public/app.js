angular.module('imageApp', [])
.controller('ImageController', ['$scope', '$http', function($scope, $http) {
  $scope.base64Image = '';

  $scope.Upload = function() {
    $http.post('/uploadImage', { base64Image: $scope.base64Image }, { headers: { 'Content-Type': 'application/json' } })
      .catch(function(error) {
        console.error('Error uploading image:', error);
      });
  };
}]);