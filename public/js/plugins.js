/**
 * Bounce in place
 */
$.fn.myBounceInPlace = function(dist, timeout, easing) {
  var $square = this,flag = 1;
  var timer;
  bounce();
  function bounce() {
    timer = setInterval(function() {
      if(flag ==1) {
          flag = -1;
      } else {
          flag = 1;
      }
      $square.animate({ top: "+="+(flag * dist)}, timeout, easing);
    },timeout);
  }

  $square.hover(function() {
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