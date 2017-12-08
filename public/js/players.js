function initPlayer(vid) {
  var id = vid;
  var options = {
    id: vid,
    loop: false,
    autoplay: true,
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

  var wrapper = 'master-video-player-inner';
  var $wrapper = $('#' + wrapper);
  var data = episodeData();
  var players = {};
  var sE = data.sceneElements;

  /**
   * Init videos in both languages.
   */
  function initPlayers() {
    for (var i = 0; i < sE.length; i++) {
      var vid = sE[i].videoId;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid);
      $el.attr('id', vid).attr('parent', sE[i].id).attr('lang', 'en');

      var vid = sE[i].videoIdGerm;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid).attr('parent', sE[i].id).attr('lang', 'de');
    }
  }

  function initTriggers() {
    $('.scene-element').each(function(i, e){
      var $trigger = $(this);
      $trigger.click(function(){

        // stop animations, launch player
        $('.scene-element').each(function() {
          $(this).bounce('stop');
        });

        var activeLang = $('.lang-link.active-lang').attr('lang');
        var vid = activeLang == 'en' ? $trigger.attr('viden') : $trigger.attr('vidde');

        var player  = initPlayer(vid, vid);
        players[vid] = player;
        player.on('ended', function(data) {
          closeVideoPlayer();
        });

        $('body').addClass('video-player-active');
        $('#master-video-player').addClass('active');
        $.each(players, function(i,e){
          // e.pause();
          $('#' + i).removeClass('active');
        });
        $('#' + vid).addClass('active');

        var elem = document.getElementById(vid);
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }

      });
    });

  }

  $('body').imagesLoaded( function() {
    initPlayers();
    initTriggers();
  });

  /**
   * Playlist nav
   */
  $('#playlist').children().click(function(){
    var parId = ($('.video-player.active').attr('parent'));
    var parIndex = $('#' + parId).index();
    var index = parIndex + parseInt($(this).attr('val'));
    var activePlayerId = $('.video-player.active').attr('id');
    players[activePlayerId].pause();
    $('.scene-element').eq(index).click();

  });

  /**
   * Close video player.
   */
  function closeVideoPlayer() {
    setTimeout(function(){
      var $activePlayer = $('.video-player.active');
      var activePlayerId = $('.video-player.active').attr('id');
      players[activePlayerId].pause();
      $('#master-video-player').removeClass('active');
      $('body').removeClass('video-player-active');
      var delay = 500;
      function removeStopped($v, $p) {
        setTimeout(function(){
          $v.remove();
          $p.remove();
          $('.removeMe');
        }, delay);
      }
      var $parent = $('#' + $activePlayer.attr('parent'));
      if ($parent.hasClass('image')) {
        setTimeout(function(){
          $('#' + $activePlayer.attr('parent'))
            .effect('shake')
            .addClass('fadeOut');
          removeStopped($('#' + $activePlayer.attr('parent')), $activePlayer);
        }, delay);
      }
    }, 500);
  }

  $('.video-controls .close, #master-video-player').click(function(){
    closeVideoPlayer();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
       closeVideoPlayer();
    }
  });


  // Controller jquery.
  $('#master-video-player').hover(function(){
    $(this).toggleClass('hover');
  }, function() {
    $(this).toggleClass('hover');
  });


});

