/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  $('body').imagesLoaded( function() {
    var $wr = $('#scene-elements');
    var functionOne = function() {
      var r = $.Deferred();
      textStyles($wr);
      imageStyles($wr);
      return r;
    };
    var functionTwo = function() {
      $.each($wr.children('.scene-element.image'), function(i){
        var $b = $(this);
        // Fade in images
        $b.velocity({
          translateX: $b.attr('l'),
          translateY: $b.attr('t'),
        }, {
          'duration': 1,
          'easing': 'linear',
        });
        setTimeout(function(){
          $b.velocity({
            opacity:1,
          }, {
            'duration': 200,
            'easing': 'linear',
          });
        }, 500);
        // Bounce in space.
        setTimeout(function(){
          var sides = loadSides();
          bounceInside($b, sides.pop(), sides, 0);
        }, numberBetween(1300, 1600));
      });
      // Text
      $.each($wr.children('.scene-element.text'), function(i){
        // Bounce in place.
        var $e = $(this);
        $e.velocity({
          translateX: $e.attr('l'),
          translateY: $e.attr('t'),
        }, {
          duration: 1,
        }, "linear");
        setTimeout(function(){
          bounceInPlace($e, numberBetween(10,20), $e.attr('l'), $e.attr('t'));
        }, numberBetween(700, 1300));
      });
    };
    functionOne().done( functionTwo() );
  });

});

/**
 *
 */
function textStyles($wr) {
  $wr.children('.scene-element.text').each(function(){
    var $el = $(this);
    var css = {};
    $el.placeIn3dTargetZone(d);
    var fontSize = 2 * $el.attr('scale') + 'em';
    var transform = 'rotate(' + $el.attr('rotate') +'deg) ';
    transform += ' scale(' + $el.attr('scale') + ')';
    $el.children().css({
      'font-size' : (2 * $el.attr('scale')) + 'em',
      'transform' : transform,
    });
    $el.css({
      'opacity' : 1,
      'z-index':5
    });
  });
}

/**
 *
 */
function imageStyles($wr) {
  $wr.children('.scene-element.image').each(function(){
    var $el = $(this);
    var css = {};
    var tSize = thumbnailSize();
    css = thumbnailImageStyles(d, tSize, null);
    $el.css(Object.assign({}, css, d.styles));
    $el.placeIn3dTargetZone(d);
  });
}

/**
 * Scene Element : place in target zone, and add custom position.
 */
$.fn.placeIn3dTargetZone = function(d) {
  var $el = this;
  // var targetZone = d.targetZone;
  var targetZone = $el.attr('target-zone');
  var $targetZone = $('[segment="' + targetZone + '"]').first();
  var zoneMax = $('[segment]').last().attr('segment');
  $el.box = {
    w: $targetZone.outerWidth(),
    h: $targetZone.outerHeight(),
    l: $targetZone.offset().left,
    t: $targetZone.offset().top,
  };
  // Set scale basedon topZone
  $el.attr('target-zone', targetZone);
  var scale = (zoneMax - targetZone) / zoneMax;
  var p = {
    s: scale,
    t: $el.box.t,
    l: $el.box.l,
  };
  // Init Place element within the bounds of its parent zone top left,
  // on an edge. Use bounds b/c scaling doesn't change outerH/W.
  // If bounds are outside window height, place at wH.
  // @TODO - this? Set styles with scale now b/c we need the new dimentions.
  // Custom placement
  var styles = {
    'z-index': targetZone * -1
  };
  var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
  var decFactor = 100;
  var coordinates = $el.data(orientation);
  var x = parseInt(coordinates[0]) / decFactor;
  var y = parseInt(coordinates[1]) / decFactor;
  var stylesTop = Math.round($el.box.t + ($el.box.h * y));
  var stylesLeft = Math.round($el.box.l + ($el.box.w * x));
  styles.transform = 'translate(' + stylesLeft + 'px, ' + stylesTop + 'px)';
  styles.width = $el.width() * p.s;
  styles.height = $el.height() * p.s;
  // if ($el.attr('type') == 'text') {
    //  }
  $el.attr('scale', p.s)
    .attr('t', stylesTop)
    .attr('l', stylesLeft);

  $el.css(styles);
  $targetZone.css({
    'border': '2px solid red',
  });
  return this;
};

/**
 *
 */
function bounceInPlace($e, dist, x1, y1) {
  // Up.
  $e.velocity({
    translateY: '+='+(dist * -1),
    // 'margin-top': (dist * -1),
  }, {
    duration: numberBetween(800,1000),
  }, "easeOutCirc");
  // Down.
  $e.velocity({
    translateY: '+='+(dist * 1),
    // 'margin-top': dist,
  }, {
    duration: numberBetween(6000, 8000),
    complete: function() {
      bounceInPlace($e, dist, x1, y1);
    }
  }, "easeInCirc");
  $e.hover(function(){
    $e.velocity("stop", true);
  }, function(){
    bounceInPlace($e, dist, x1, y1);
  });
}

/**
 *
 */
function loadSides(){
  return shuffle([0,1,2,3]);
}

/**
 *
 * @param {*} x1
 * @param {*} x2
 * @param {*} y1
 * @param {*} y2
 */
function distanceCalc(x1, x2, y1, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt( a*a + b*b );
}


function durationCalc(x1, x2, y1, y2) {
  var d = distanceCalc(x1, x2, y1, y2);
  var speed = 70 * d;
  // console.log(d);
  return speed;
}

/**
 *
 * @param {*}
 * @param {*} s
 * @param {*} array
 * @param {*} i
 */
function bounceInside($e, s, array, i) {
  if (array.length == 0) {
    array = shuffle(loadSides());
    s = array.pop();
  }
  // var s = array.pop();
  var $tz = $('[segment=' + $e.attr('target-zone') + ']');
  var offset = $tz.offset();
  var W = $tz.outerWidth();
  var w = $e.outerWidth();
  var H = $tz.outerHeight();
  var h = $e.outerHeight();
  var r = numberBetween(0, $tz.width() - w);
  var x1, y1, x2, y2;
  x1 = $e.offset().left;
  y1 = $e.offset().top;
  switch (s) {
    case 0: // point on top
      x2 = offset.left + r;
      y2 = offset.top;
      break;
    case 1: // point on right
      x2 = offset.left + W - w;
      y2 = offset.top + r;
      break;
    case 2: // point on bottom
      x2 = offset.left + r;
      y2 = offset.top + H - h;
      break;
    case 3: // point on left
      x2 = offset.left;
      y2 = offset.top + r;
      break;
  }
  var easing = i == 0 ? 'linear' : 'linear';
  // var easing = i == 0 ? 'easeInSine' : 'linear';
  i++;
  $e.velocity({
    translateX: [x2, x1],
    translateY: [y2, y1],
  }, {
    'duration': durationCalc(x1, x2, y1, y2) / $e.attr('scale'),
    'easing': easing,
    complete: function() {
      bounceInside($e, array.pop(), array);
    }
  });
  $e.hover(function(){
    $e.velocity("stop", true);
  }, function(){
    bounceInside($e, array.pop(), array);
  });
  $(window).focus(function() {
    setTimeout(function(){
      bounceInside($e, array.pop(), array);
    }, numberBetween(1300, 1600));

  });

  $(window).blur(function() {
    $e.velocity("stop", true);
  });
}

/**
 *
 */
function thumbnailSize() {
  var t = {
    w: '200px', h: '150px'
  };
  if (window.innerWidth > 600) {
    var t = {
      w: '200px', h: '150px'
    };
  }
  if (window.innerWidth > 800) {
    var t = {
      w: '290px', h: '220px'
    };
  }
  return t;
}

/**
 *
 * @param {*} d
 * @param {*} tSize
 * @param {*} id
 */
function thumbnailImageStyles(d, tSize, id) {
  return {
    // 'background-image':'url("/releases/' + id + '/' + d.id + '.jpg")',
    'width': tSize.w,
    'height': tSize.h,
    // 'transform' : 'translateY(-50%)',
  };
}

function thumbnailTextStyles(d, tSize) {
  var orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  return {
    'left': 0,
    'top': 0,
    'z-index': 1,
    'transform' : d[orientation].rotate
  };
}


/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
