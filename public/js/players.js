function initPlayer(data) {
  var id = data.videoId;
  var options = {
    id: data.videoId,
    loop: false,
    autoplay: false,
    width: 640,
    height: 480
  };
  var player = new Vimeo.Player(id, options);
  return player;
}

/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function(){

  var wrapper = 'master-video-player';
  var $wrapper = $('#' + wrapper);
  var data = episodeData();
  var players = {};
  var sE = data.sceneElements;

  function initPlayers() {
    for (var i = 0; i < sE.length; i++) {
      var vid = sE[i].videoId;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid);
      var player  = initPlayer(sE[i], wrapper);
      players[vid] = player;
    }
  }
  function initTriggers() {
    for (var i = 0; i < sE.length; i++) {
      var vid = sE[i].videoId;
      var $trigger = $('#' + sE[i].name);
      $trigger.attr('vid', sE[i].videoId);
      // Click init & play for target videos.
      $trigger.click(function(){
        $('body').addClass('video-player-active');
        $('#' + wrapper).addClass('active');
        var vid = $(this).attr('vid');
        // Pause any active videos
        $.each(players, function(i,e){
          e.pause();
          $('#' + i).removeClass('active');
        });
        $('#' + vid).addClass('active');
        players[vid].play();
      });
    }
  }
  initPlayers();
  initTriggers();





  $('.video-controls .close').click(function(){
    $.each(players, function(i,e){
      e.pause().then(function() {
        // the video was paused
      }).catch(function(error) {
        console.log(error);
          switch (error.name) {
              case 'PasswordError':
                  // the video is password-protected and the viewer needs to enter the
                  // password first
                  break;

              case 'PrivacyError':
                  // the video is private
                  break;

              default:
                  // some other error occurred
                  break;
          }
      });
    });
    // var $active = $('#master-video-player .target-video.active');
    // $('#' + $active.attr('id')).removeClass('active');
    $('#master-video-player').removeClass('active');
    $('body').removeClass('video-player-active');
  });


  // Controller jquery.
  $('#master-video-player').hover(function(){
    $(this).toggleClass('hover');
  }, function() {
    $(this).toggleClass('hover');
  });


});

