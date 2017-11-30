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

  if (data.enable !== true) return;
  if (data.dev == true) $('body').addClass('dev');

  for (var i = 0; i < sE.length; i++) {
    var data = sE[i];
    // insert data container
    $wrapper.append(append);
    $wrapper.children().last()
      .attr('id', data.name)
      .attr('sIndex', i)
      .addClass(data.type + ' scene-element');

    var $el = $('#' + data.name);

    // Inline styles.
    if ('styles' in data) {
      $el.css(data.styles);
    }
    // Thumbnail.
    if ('thumbnail' in data) {
      $el.css({
        'background-image':'url("files/' + data.thumbnail + '")',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'cursor': 'pointer',
        'width': '100px',
        'height': '200px',
      });

    }

    // Init target data.
    if ('videoId' in data) {
      var player = initMasterVideo(data, data.videoId);
      players[data.videoId] = player;
      $el.attr('vid', data.videoId);
      $el.addClass('video-trigger');
    }
  }

  // Click init & play for target videos.
  $('.video-trigger').click(function(){
    $('#master-video-player').addClass('active');
    var vid = $(this).attr('vid');
    // Pause any active videos
    $.each(players, function(i,e){
      e.pause();
      $('#' + i).removeClass('active');
    });
    $('#' + vid).addClass('active');
    players[vid].play();
  });


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

