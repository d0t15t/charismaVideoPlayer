/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  $('body').imagesLoaded( function() {
    var textElements = function() {
      var $wr = $('#scene-elements');
      initTextEl(d.e, $wr);
      initTextEl(d.n, $wr);
      sPreEtransition(sEtransition);
    };
    var imageElements = function(callback) {
      var $wr = $('#scene-elements');
      initImages(d.e, $wr);
      sPreEtransition(sEtransition);
      callback();
    };
    imageElements(textElements);
    setTimeout(function(){
      initOrbits();
    },1000);
  });
});


/**
 * Init Names
 */
function initTextEl(n, $wr) {
  var append = '<div class="scene-element"></div>';
  if (n.hasOwnProperty('items')) {
    for (var i = 0; i < n.items.length; i++) {
      var d = n.items[i];
      if (d.type == 'text') {
        $wr.prepend(append);
        var d = n.items[i];
        var $el = $wr.children().first();
        $el.sceneElAttr(d);
        var text = '<div class="text">' + d.name + '</div>';
        $el.append(text);
        $el.css(d.styles);
        $el.placeIn3dTargetZone(d);
        css = thumbnailTextStyles(d);
        css.transform += ' scale(' + $el.attr('scale') + ')';
        $el.children().css(css);
      }
    }
  }
}

/**
 * Init Images
 */
function initImages(n, $wr) {
  var append = '<div class="scene-element"></div>';
  if (n.hasOwnProperty('items')) {
    for (var i = 0; i < n.items.length; i++) {
      var d = n.items[i];
      if (d.type == 'image') {
        $wr.prepend(append);
        var $el = $wr.children().first();
        $el.sceneElAttr(d);
        var css = {};
        var tSize = thumbnailSize();
        css = thumbnailImageStyles(d, tSize, n.releaseId);
        var overlayPath = '/releases/' + n.releaseId + '/' + d.id;
        var img = '<img class="overlay-gif" src="' + overlayPath + '.gif"></img>';
        $el.append(img);
        $el.css(Object.assign({}, css, d.styles));
        $el.placeIn3dTargetZone(d);
      }
    }
  }
}

/**
 * Scene Element default attributes.
 */
$.fn.sceneElAttr = function(d) {
  var $el = this;
  $el.attr('id', d.id)
    .attr('name', d.name)
    .attr('sIndex', i)
    .attr('target-zone', d.targetZone)
    .attr('type', d.type)
    .attr('vidEn', d.videoId)
    .attr('vidDe', d.videoIdGerm)
    .addClass(d.type)
    .addClass(d.classes);
  return this;
};

/**
 * Scene Element default attributes.
 */
$.fn.placeIn3dTargetZone = function(d) {
  var $el = this;
  var targetZone = d.targetZone;
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
    // 'z-index': targetZone * -1
  };
  var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
  var decFactor = 100;
  var x = parseInt(d[orientation].x) / decFactor;
  var y = parseInt(d[orientation].y) / decFactor;

  var stylesTop = Math.round($el.box.t + ($el.box.h * y));
  var stylesLeft = Math.round($el.box.l + ($el.box.w * x));
  // styles.transform = 'translate(' + stylesLeft + 'px,' + stylesTop + 'px)';
  styles.transform = 'scale(' + (p.s) + ')';
  // if ($el.attr('type') == 'text') {
  //  }
  $el.attr('scale', p.s)
     .attr('t', stylesTop)
     .attr('l', stylesLeft);

  $el.css(styles);
  return this;
};

/**
 *
 */
var sPreEtransition = function(callback) {
  var $s = $('.scene-element');
  $s.each(function(i){
    if ($s.attr('state') == 'done') return;
    var $e = $(this);
    var x1 = ($(window).width() / 2) + ($e.width() / 2);
    var y1 = $(window).height() / 2 - ($(window).height() / 8);

    var x2 = $e.attr('l');
    var y2 = $e.attr('t');

    $e.css({
      'transform': 'translateX(' + x2 + 'px) translateY(' + y2 + 'px) scale(' + $e.attr('scale') + ')',
    });
  });
  setTimeout(function(){
    callback();
  }, 500);
};
/**
 *
 */
var sEtransition = function() {
  var $s = $('.scene-element');
  $s.each(function(i){
    var $e = $(this);
    var x2 = $e.attr('l');
    var y2 = $e.attr('t');
    switch ($e.attr('type')) {
      case 'text':
      if ($e.hasClass('scene_element--title')) {
        bounceInPlace($e, numberBetween(10,20), x2, y2, $e.attr('scale'));
      }
      break;
    }
    $e.css({
      opacity: 1
    });
    $e.attr('state', 'done');
    var color = getRandomColor();
    setTimeout(function(i){

      // TESTING
      // $e.css({
      //   'border': '5px solid ' + color
      // });
      // $('#grid-' + $e.attr('target-zone')).css({
      //   'border': '5px solid ' + color
      // });

    }, 0);
    // }, 100);
    // }, 100 * (i+1));
  });
};

/**
 *
 */
function bounceInPlace($e, dist, x1, y1, s) {
  // Up.
  $e.velocity({
    translateX: [x1, x1],
    translateY: ['+='+(dist * -1), y1],
    scale: [s, s],
    opacity: 1
  }, {
    duration: numberBetween(800,1000),
  }, "easeOutCirc");
  // Down.
  $e.velocity({
    translateY: ['+='+dist, y1],
    translateX: [x1, x1],
    scale: [s, s],
  }, {
    duration: numberBetween(6000, 8000),
    complete: function() {
      bounceInPlace($e, dist, x1, y1, s);
    }
  }, "easeInCirc");
}


/**
 * Init orbits.
 */
function initOrbits() {
  $('.scene-element.image').each(function(i, e){
    var $e = $(this);
    var tz = $e.attr('target-zone');
    var $tz = $('[segment="' + tz + '"]');
    // function orbit($e) {

    //   var x1 = numberBetween(0, $tz.width());
    //   var y1 = numberBetween(0, $tz.width());
    //   var x = 0;
    //   var y = 0;
    //   var offset = $tz.offset();
    //   x = offset.left + x1 - $e.offset().left;
    //   y = offset.top + y1 - $e.offset().top;
    //   setTimeout(function(){
    //     $e.velocity({
    //       translateX: '+=' + x,
    //       translateY: '+=' + y,
    //     }, {
    //       'duration': numberBetween(44444,66666),
    //       'easing': 'linear',
    //     }, {
    //       complete: function() {
    //         orbit($e);
    //       }
    //     });
    //     $e.velocity('reverse', {
    //       complete: function(){
    //         orbit($e);
    //       }
    //     });
    //   });
    // }
    function orbit() {
      var offset = $tz.offset();
      var x = numberBetween(offset.left, offset.left + $tz.width()) - $e.width();
      var y = numberBetween(offset.top, offset.top + $tz.height()) - $e.height();
      $e.velocity({
        // translateX: x,
        // translateY: y,
        translateX: [x, $e.attr('l')],
        translateY: [y, $e.attr('t')],
        // translateX: [offset.left, $e.attr('l')],
        // translateY: [offset.top, $e.attr('t')],
        scale: [$e.attr('scale'), $e.attr('scale')]
      }, {
        // 'duration': 1000,
        'duration': numberBetween(44444,66666),
        'easing': 'linear',
      });
      $e.velocity('reverse', {
        complete: function(){
          orbit();
        }
      });
    }
    orbit($e);


    setTimeout(function(){
    }, 900 * i);

  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
    'background-image':'url("/releases/' + id + '/' + d.id + '.jpg")',
    'width': tSize.w,
    'height': tSize.h,
    'transform' : 'translateY(-50%)',
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
