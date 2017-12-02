/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  var data = episodeData();
  var sE = data.sceneElements;


  // Sort by target zone
  temp = 0;
  for (i = 0; i < sE.length - 1; i++) {
    for (j = i + 1; j < sE.length; j++) {
      if (sE[i].targetZone > sE[j].targetZone) {
        temp = sE[j];
        sE[j] = sE[i];
        sE[i] = temp;
      }
    }
  }

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
        .attr('type', d.type)
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
          // Insert text with another wrapper.
          var text = '<div class="text">' + d.text + '</div>';
          $el.append(text);
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
      console.log(d);
      thumbs[d.name] = $('#' + d.name);
      var th = thumbs[d.name];
      var $el = th;

      // Identify target zone & coordinates
      if (d.hasOwnProperty('targetZone')) {
        var targetZone = d.targetZone;
        var $targetZone = $('[segment="' + targetZone + '"]').first();
        var zoneMax = $('[segment]').last().attr('segment');
        th.box = {
          w: $targetZone.outerWidth(),
          h: $targetZone.outerHeight(),
          l: $targetZone.offset().left,
          t: $targetZone.offset().top,
        };
        // Set scale basedon topZone
        $el.attr('target-zone', targetZone);
        var scale = (zoneMax - targetZone) / zoneMax;
        d.styles.transform += 'scale(' + scale + ')';

        // Init Place element within the bounds of its parent zone top left,
        // on an edge. Use bounds b/c scaling doesn't change outerH/W.
        // If bounds are outside window height, place at wH.
        $el.css(d.styles).attr('scale', scale);
        // Set styles with scale now b/c we need the new dimentions.
        var elBounds = $el[0].getBoundingClientRect();
        var styles = {
          'top' : (th.box.t < 0) ? 0 : th.box.t,
          'left' : (th.box.l < 0) ? 0 : th.box.l,
        };
        // Custom placement
        if (d.hasOwnProperty('position')) {
          if (
            d.position.hasOwnProperty('x')
            && d.position.hasOwnProperty('y')
          ) {
            // Get user input: "10%" as a decimal.
            var decFactor = 100;
            var x = parseInt(d.position.x) / decFactor;
            var y = parseInt(d.position.y) / decFactor;
            styles.top = (th.box.t + (th.box.h * y)) - (elBounds.height / 2);
            styles.left = th.box.l + (th.box.w * x) - (elBounds.width / 2);
          }
        }
        switch($el.attr('type')) {
          case 'text':
            $el.children('.text').css({
              'transform' : 'scale(' + (scale * 1.5) + ') ' + d.rotate,
            });
            var dist    = numberBetween(30, 70);
            var timeout = numberBetween(4300, 7333);
            var easing  = 'easeInOutBack';
            $el.myBounceInPlace(dist, timeout, easing);
            break;
        }
        $el.css(styles);


        // // Better placement
        // switch ($el.attr('type')) {
        //   case 'image':
        //     var styles = {
        //       left : '500px',
        //       top : ($(window).height() / 2 ) + 'px'
        //     };
        //     // $el.css(styles);
        //     break;
        // }
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
        // show target zone in element
        var str = '<div class="target-zone-label">' + 'segment: ' + d.targetZone + '</div>';
        $el.append(str);
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
    'width': tSize.w,
    'height': tSize.h,
    'transform' : 'translateY(-50%)',
  };
}

function thumbnailTextStyles(d, tSize) {
  return {
    'left': 0,
    'top': 0,
    'z-indez': 1,
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
