/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  var $wr = $('#scene-elements');

  // Init names from data and insert into wrapper.
  // Fade in names.
  initTextEl(d.n, $wr);
  sceneElementsFadeTransition();

  // Init titles from data and insert into wrapper.
  // Fade in + images with zoom effect.
  initTextEl(d.e, $wr);

  $('body').imagesLoaded( function() {
    initImages(d.e, $wr);

    // Zoom in elements
    sceneElementsZoomTransition();

    // Bounce title elements
    var dist     = numberBetween(30, 70);
    var duration = numberBetween(4300, 7333);
    var pause = 500;
    var easing1  = 'easeOutCirc';
    var easing2  = 'easeInCirc';
    $('.scene_element--title').each(function(i){
      $(this).myBounceInPlace(dist, duration, pause, easing1, easing2);
    }, 1000 * i );

    // initOrbits();

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
        var overlayPath = '/releases/' + n.releaseId + '/' + d.name;
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
  d.styles.transform += 'scale(' + (scale) + ')';

  // Init Place element within the bounds of its parent zone top left,
  // on an edge. Use bounds b/c scaling doesn't change outerH/W.
  // If bounds are outside window height, place at wH.
  $el.css(d.styles).attr('scale', scale);
  // Set styles with scale now b/c we need the new dimentions.
  var elBounds = $el[0].getBoundingClientRect();
  var styles = {
    // 'top' : (th.box.t < 0) ? 0 : th.box.t,
    // 'left' : (th.box.l < 0) ? 0 : th.box.l,
    'top' : $el.box.t,
    'left' : $el.box.l,
  };
  $el.css(styles);
  // Custom placement
  var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
  var decFactor = 100;
  var x = parseInt(d[orientation].x) / decFactor;
  var y = parseInt(d[orientation].y) / decFactor;

  styles.top = ($el.box.t + ($el.box.h * y));
  styles.left = $el.box.l + ($el.box.w * x);

  $el.css(styles);

  return this;
};

/**
 *
 */
function sceneElementsFadeTransition() {
  var $fadeElements = $('.scene_element--name');
  setTimeout(function(){
    $fadeElements.addClass('se-visible');
  }, 400);
}

/**
 *
 */
function sceneElementsZoomTransition() {
  var $zoomElements = $('.scene-element__zoom-in');
  setTimeout(function(){
    $zoomElements.addClass('se-visible');
    $zoomElements.removeClass('scene-element__zoom-in');
  }, 700);
}


/**
 * Init orbits.
 */
function initOrbits() {
  for (var i = 0; i < sE.length; i++) {
    var $el = $('#' + sE[i].name);

    var targetZone = sE[i].targetZone;

    var speed = 10;
    // var targetZoneId = (window.innerWidth < 600) ? '#scene-elements' : '#grid-' + targetZone;
    var targetZoneId = '#grid-' + targetZone;
    if ($el.attr('type') == 'image') {
      $el.bounce('start', {
        'minSpeed'	: speed,
        'maxSpeed'	: speed,
        'zone'		: targetZoneId
      });
      $el.hover(function() {
        $(this).each(function() {
          $(this).bounce('stop');
        });
      }, function() {
        $(this).each(function() {
          $(this).bounce('start', {
            'minSpeed'	: speed,
            'maxSpeed'	: speed,
            'zone'		: targetZoneId
          });
        });
      });

    }
  }
  $('.master-controls .close').click(function(){
    for (var i = 0; i < sE.length; i++) {
      var $el = $('#' + sE[i].name);
      var targetZone = sE[i].targetZone;
      var speed = 10;
      var targetZoneId = (window.innerWidth < 600) ? '#scene-elements' : '#grid-' + targetZone;
      if ($el.attr('type') == 'image') {
        $el.bounce('start', {
          'minSpeed'	: speed,
          'maxSpeed'	: speed,
          'zone'		: targetZoneId
        });
      }
    }
  });
}

function thumbnailSize() {
  var t = {
    w: '100px', h: '75px'
  };
  if (window.innerWidth > 600) {
    var t = {
      w: '100px', h: '75px'
    };
  }
  if (window.innerWidth > 800) {
    var t = {
      w: '280px', h: '235px'
    };
  }
  return t;
}

function thumbnailImageStyles(d, tSize, id) {
  return {
    'background-image':'url("/releases/' + id + '/' + d.name + '.jpg")',
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
