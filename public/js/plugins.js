/**
 * Bounce in place
 */
$.fn.myBounceInPlace = function(dist, duration, pause, easing1, easing2) {
  var $object = this,flag = 1;
  var timer;
  bounce();
  function bounce() {
    timer = setInterval(function() {
      if(flag ==1) {
          flag = -1;
      } else {
          flag = 1;
      }
      var easing = (flag == 1) ? easing1 : easing2;
      var transform = 'translateY(' + (flag * dist) + 'px)';
      $object.animate({ top: "+="+(flag * dist)}, duration, easing);
      // $object.animate({ 'transform': transform }, duration, easing);
    },pause);
  }

  $object.hover(function() {
      clearInterval(timer);
  }, function() {
      bounce();
  });

  return this;
};

/**
 *
 */
function numberBetween(a, b) {
  return Math.floor(Math.random() * b) + a;
}