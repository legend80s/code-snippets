// angular ui bootstrap directive 
// show tooltip / popover only when the text is overflow
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
          // make popover-trigger !="overflowEllipsis" work as well
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
