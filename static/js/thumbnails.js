/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  var data = episodeData();
  var sE = data.sceneElements;

  /**
   * Init Thumbnails
   */
  function initThumbnails() {
    var $wrapper = $('#scene-elements');
    var append = '<div class="scene-element"></div>';

    if (data.enable !== true)
      return;
    if (data.dev == true)
      $('body').addClass('dev');

    // Insert thumbnails.
    for (var i = 0; i < sE.length; i++) {
      var d = sE[i];
      $wrapper.prepend(append)
        .children().first()
        .attr('id', d.name)
        .attr('sIndex', i)
        .attr('target-zone', d.targetZone)
        .addClass(d.type + ' scene-element');
      var $el = $('#' + d.name);
      if ('classes' in d)
        $el.addClass(d.classes);

      // Process thumbnail types
      var css = {};
      switch(d.type) {
        case 'image':
          if ('thumbnail' in d)
            var tSize = thumbnailSize();
            css = thumbnailImageStyles(d, tSize);
            break;
        case 'text':
          css = thumbnailTextStyles(d, tSize);
          $el.text(d.text);
          // bounce
          $el.myBounceInPlace(numberBetween(70, 100), numberBetween(3300, 6333), 'easeInOutBack');
          break;
      }

      $el.css(Object.assign({}, css, d.styles));
    }
  }
  function placeThumbnails() {
    var $devWrapper = placeThumbnailsDev();

    var thumbs = {};
    for (var i = 0; i < sE.length; i++) {
      var d = sE[i];
      thumbs[d.name] = $('#' + d.name);
      var th = thumbs[d.name];
      var $el = th;

      // Identify target zone & coordinates
      if (d.hasOwnProperty('targetZone')) {
        var targetZone = d.targetZone;
        var $targetZone = $('[segment="' + targetZone + '"]').first();
        var zoneMax = $('[segment]').last().attr('segment');
        th.box = {
          w: $targetZone.width(),
          h: $targetZone.height(),
          l: $targetZone.offset().left,
          t: $targetZone.offset().top,
        };
        // Set scale basedon topZone
        $el.attr('target-zone', targetZone);
        var scale = (zoneMax - targetZone) / zoneMax;
        d.styles.transform += ' scale(' + scale + ')';

        // Place element within the bounds of its parent zone,
        // although not 'in' the target container.
        var styles = {
          'top' : (th.box.t < 0) ? th.box.h / 2 : th.box.t,
          'left' : (th.box.l < 0) ? th.box.w / 2 : th.box.l,
          'width' : $el.width(),
          'height' : $el.height(),
          // 'background-size' : ($el.width() * scale ) ($el.height() * scale)
          // 'width' : $el.width() * scale,
          // 'height' : $el.height() * scale,
        };
        $el.css(Object.assign({}, styles, d.styles))
          .attr('scale', scale);
      }

      // Update dev elements
      if (data.dev == true) {
        $devWrapper.append('<div class="placement-dev-wrapper"></div>');
        var $dev = $devWrapper.children().last();
        $dev.css({
          'top' :    th.box.t,
          'left' :   th.box.l,
          'width' :  th.box.w,
          'height' : th.box.h,
          'border' : '5px solid red',
        });
      }
    }
  }
  initThumbnails();
  placeThumbnails();

  /**
   *
   */
  function placeThumbnailsDev() {
    if (data.dev == true) {
      $('#scene-elements').append('<div id="placement-dev-wrapper"></div>');
      var $devWrapper = $('#placement-dev-wrapper');
    }
    return $devWrapper;
  }

});

function thumbnailSize() {
  var t = {
    w: '400px', h: '300px'
  };
  // var mq = window.matchMedia( "(min-width: 800px)" );

  if (window.matchMedia( "(min-width: 800px)" )) {
    // t.w =
  }
  return t;
}

function thumbnailImageStyles(d, tSize) {
  return {
    'background-image':'url("images/' + d.thumbnail + '")',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'cursor': 'pointer',
    'width': tSize.w,
    'height': tSize.h,
    'left' : 0,
    'top' : '50%',
    'transform' : 'translateY(-50%)',
    'position': 'absolute',
    'z-indez': 1
  };
}

function thumbnailTextStyles(d, tSize) {
  return {
    'position': 'absolute',
    'cursor': 'pointer',
    'left': 0,
    'top': 0,
    'z-indez': 1,
    'display': 'inline'
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
