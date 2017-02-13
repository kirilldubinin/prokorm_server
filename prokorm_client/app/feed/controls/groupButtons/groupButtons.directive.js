(function() {
  angular.module('feed').directive('groupButtons', groupButtons);
  function groupButtons() {
      var directive = {
          restrict: 'E',
          templateUrl: 'app/feed/controls/groupButtons/groupButtons.html',
          scope: {
            items: '=',
            allowAdd: '=',
            onAdd: '&',
            onDelete: '&',
            onSelect: '&'
          },
          replace: true,    
          controller: GroupButtonsController,
          controllerAs: 'groupButtons',
          bindToController: true
      };
      return directive;
  }

  function GroupButtonsController($scope) {

    var self = this;
    
    $scope.items = self.items;
    $scope.$watchCollection('items.length', function () {

      console.log(self.items.length);
      self.selected = _.last(self.items);
      self.onSelect({item: self.selected});  
    }, true);

    self.onClick = function (item) {
      console.log(self.items.length);
      self.selected = item;
      self.onSelect({item: self.selected});
    };
  }
})();