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
      var transform = '+= translateY(' + (flag * dist) + ')';
      $object.animate({ 'top': "+="+(flag * dist)}, duration, easing);
      // $object.animate({ 'transform': transform }, duration, easing);

      // $object.animate({  fake: 200, fake2: 10 }, {
      //     step: function(now,fx) {
      //       $(this).css('-webkit-transform','translate('+now+'px,'+now+'px )');
      //     },
      //     duration:duration
      // },easing);




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