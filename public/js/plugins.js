/**
 * Bounce in place
 */
$.fn.myBounceInPlace = function(dist, duration, pause, easing1, easing2) {
  var $object = this,flag = 1;
  var timer;
  var position = $object.offset();
  bounce();
  function bounce() {
    timer = setInterval(function() {
      if(flag ==1) {
          flag = -1;
      } else {
          flag = 1;
      }
      var easing = (flag == 1) ? easing1 : easing2;
      $object.animate({ 'margin-top': (flag * dist)}, duration, easing);
    },pause);
  }

  if (($object.position().top + $object.height()) >= $(window).height()) {
    console.log('reset');
    $object.fadeOut()
    $object.css({
      'top': position.top,
      'left': position.left
    }).fadeIn();
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