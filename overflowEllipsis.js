.directive('popoverTrigger', ['$timeout', function(timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var promise;

        element.on('mouseenter', function() {
          if (element[0].offsetWidth < element[0].scrollWidth) {
            element.trigger('overflowEllipsis');
          }
          if(promise) {
            timeout.cancel(promise);
          }
          // 保证非popover-trigger="overflowEllipsis"仍然正常工作
          element.trigger('mouseenterDelay');
        });
        element.on('mouseleave', function() {
          element.trigger('overflowNormal');

          promise = timeout(function() {
            element.trigger('mouseleaveDelay');
          }, 1000);
        });
      }
    }
  }])
