/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){
  var data = episodeData();
  var sE = data.sceneElements;
  var targetZones = [];

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
        .attr('id', d.id)
        .attr('name', d.name)
        .attr('sIndex', i)
        .attr('target-zone', d.targetZone)
        .attr('type', d.type)
        .attr('vidEn', d.videoId)
        .attr('vidDe', d.videoIdGerm)
        .addClass(d.type + ' scene-element');
      var $el = $('#' + d.id);
      if ('classes' in d)
        $el.addClass(d.classes);

      // Process thumbnail types
      var css = {};
      switch(d.type) {
        case 'image':
          var tSize = thumbnailSize();
          css = thumbnailImageStyles(d, tSize, data);
          var overlayPath = '/releases/' + data.releaseId + '/' + sE[i].name;
          var img = '<img class="overlay-gif" src="' + overlayPath + '.gif"></img>';
          $el.append(img);
          break;


          case 'text':
          css = thumbnailTextStyles(d, tSize);
          // Insert text with another wrapper.
          var text = '<div class="text">' + d.name + '</div>';
          $el.append(text);
          break;
      }

      $el.css(Object.assign({}, css, d.styles));
    }
  }
  /**
   * Init Placement and mods.
   */
  function placeThumbnails() {
    var $devWrapper = placeThumbnailsDev();
    var thumbs = {};
    for (var i = 0; i < sE.length; i++) {
      var d = sE[i];

      thumbs[d.id] = $('#' + d.id);
      var th = thumbs[d.id];
      var $el = th;

      // Identify target zone & coordinates
      if (d.hasOwnProperty('targetZone')) {
        var targetZone = d.targetZone;
        var $targetZone = $('[segment="' + targetZone + '"]').first();
        var zoneMax = $('[segment]').last().attr('segment');
        targetZones[targetZone] = $targetZone;
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
          // 'top' : (th.box.t < 0) ? 0 : th.box.t,
          // 'left' : (th.box.l < 0) ? 0 : th.box.l,
          'top' : th.box.t,
          'left' : th.box.l,
        };
        $el.css(styles);
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
            // styles.top = (th.box.t + (th.box.h * y)) - (elBounds.height / 2);
            // styles.left = th.box.l + (th.box.w * x) - (elBounds.width / 2);
            styles.top = (th.box.t + (th.box.h * y));
            styles.left = th.box.l + (th.box.w * x);
          }
        }
        switch($el.attr('type')) {
          case 'text':
            $el.children('.text').css({
              'transform' : 'scale(' + (scale * 1.5) + ') ' + d.rotate,
            });

            var topPos = (th.box.t + (th.box.h * y)) - (elBounds.height / 2);
            var lefPos = th.box.l + (th.box.w * x) - (elBounds.width / 2);

            // if (topPos < 0 || topPos + $el.height() > window.innerWidth) {
            //   styles.top = numberBetween(0, window.innerHeight - 100);
            // }
            // if (lefPos < 0 || lefPos + $el.width() > window.innerWidth) {
            //   styles.left = numberBetween(0, window.innerWidth - 100 );
            // }

            if ($el.hasClass('scene_element--title')) {
              var dist     = numberBetween(30, 70);
              var duration = numberBetween(4300, 7333);
              var pause = 500;
              var easing1  = 'easeOutCirc';
              var easing2  = 'easeInCirc';
              $el.myBounceInPlace(dist, duration, pause, easing1, easing2);
            }

            break;
          case 'image':
            if (true) {
              // var dist     = numberBetween(30, 70);
              // var duration = numberBetween(4300, 7333);
              // var dist     = 20;
              // var duration = 4000
              // var pause = 500;
              // var easing1  = 'easeOutCirc';
              // var easing2  = 'easeInCirc';
              // $el.myBounceInPlace(dist, duration, pause, easing1, easing2);

            }
            // $el.remove();
            break;
        }
        $el.css(styles);
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

  $('body').imagesLoaded( function() {
    // images have loaded
    initThumbnails();
    placeThumbnails();
    // initOrbits();


    function initSeFade() {
      $('.scene-element').each(function(i, e){
        var $el = $(this);

        var delay = 50;
        var stepTime = 100;
        var time = delay;
        setTimeout(function(){
          time = (time < delay) ? time : i * 10 * time;
          $el.addClass('se-visible');
        }, time * i);
      });
    }
    initSeFade();


  });

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

function thumbnailImageStyles(d, tSize, data) {
  return {
    'background-image':'url("/releases/' + data.releaseId + '/' + d.name + '.jpg")',
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
