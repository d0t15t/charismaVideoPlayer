/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){

  var playerId = 'video-player';
  var elementsId = 'scene-elements';

  var data = episodeData();
  var sE = data.sceneElements;
  var players = {};
  var $wrapper = $('#scene-elements');
  var append = '<div class="scene-element"></div>';
  var zoneMax = $('.grid-segment').last().attr('zone');


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
      .addClass(d.type + ' scene-element');
    var $el = $('#' + d.name);
    if ('classes' in d)
      $el.addClass(d.classes);
    // Thumbtypes
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
        break;
    }
    $el.css(css);

    // Place element within the bounds of its parent zone.
    var $parentZone = $('[zone="' + d.targetZone + '"]').first();
    var $lastZone = $('[zone="' + d.targetZone + '"]').last();
    var maxTop = ($parentZone.outerHeight() > $(window).outerHeight())
      ? 0 : $parentZone.offset().top;
    var maxLeft = ($parentZone.outerWidth() > $(window).outerWidth())
      ? 0 : $parentZone.offset().left;
    $el.css({
      'top': maxTop,
      'left': maxLeft,
    });
    // If custom position is set, add to current position
    if (typeof d.position !== 'undefined') {
      $el.css({
        'left': maxLeft + d.position.x,
        'top': maxTop + d.position.y,
      });
    }
    // Set scale basedon parentZone
    if (typeof d.targetZone !== 'undefined') {
      $el.attr('target-zone', d.targetZone);
      if(d.hasOwnProperty('targetZone')){
        var scale = (zoneMax - d.targetZone) / zoneMax;
        d.styles.transform += ' scale(' + scale + ')';
      }

    }

    // var t = getRandomInt(
    //   maxTop,
    //   maxLeft.outerHeight() - $el.outerHeight()
    // );
    // var l = getRandomInt(
    //   $parentZone.offset().left + $el.outerWidth(),
    //   $maxParentWidth.outerWidth() - $el.outerWidth()
    // );
    // $el.css({
    //   'top': t,
    //   'left': l
    // });

    $el.css(d.styles);

    // Init target data.
    if ('videoId' in d) {
      var player = initMasterVideo(d, d.videoId);
      players[d.videoId] = player;
      $el.attr('vid', d.videoId);
      $el.addClass('video-trigger');
    }
  }

  // Click init & play for target videos.
  // $('.video-trigger').click(function(){
  //   $('#master-video-player').addClass('active');
  //   var vid = $(this).attr('vid');
  //   // Pause any active videos
  //   $.each(players, function(i,e){
  //     e.pause();
  //     $('#' + i).removeClass('active');
  //   });
  //   $('#' + vid).addClass('active');
  //   players[vid].play();
  // });


  $('.video-controls .close').click(function(){
    $.each(players, function(i,e){
      e.pause();
    });
    var $active = $('#master-video-player .target-video.active');
    $('#' + $active.attr('id')).removeClass('active');
    $('#master-video-player').removeClass('active');
  });


  // Controller jquery.
  $('#master-video-player').hover(function(){
    $( this ).toggleClass('hover');
  }, function() {
    $( this ).toggleClass('hover');
  });


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
    'position': 'absolute',
    'z-indez': 1
  };
}

function thumbnailTextStyles(d, tSize) {
  return {
    'cursor': 'pointer',
    'top': '25%',
    'left': 0,
    'position': 'absolute',
    'z-indez': 1,
    'display': 'inline'
  };
}

function initMasterVideo(data, wrapper) {
  var $container = $('#' + wrapper);
  var id = data.videoId;
  var options = {
    id: data.videoId,
    width: 640,
    loop: false,
    autoplay: false,
  };
  // player = new Vimeo.Player(id, options);



    // On finish, remove iframe
  // player.on('ended', function(){
  //   $wrapper.removeClass('active');
  // });

  // return player;
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
