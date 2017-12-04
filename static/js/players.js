function initPlayer(vid) {
  var id = vid;
  var options = {
    id: vid,
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

  /**
   * Init videos in both languages.
   */
  function initPlayers() {
    for (var i = 0; i < sE.length; i++) {
      var vid = sE[i].videoId;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid);
      $el.attr('id', vid).attr('parent', sE[i].id);
      // var player  = initPlayer(vid, wrapper);
      // players[vid] = player;

      var vid = sE[i].videoIdGerm;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid).attr('parent', sE[i].id);
      // var player  = initPlayer(vid, wrapper);
      // players[vid] = player;
    }
  }

  function initTriggers() {
    $('.scene-element').each(function(i, e){
      var $trigger = $(this);
      $trigger.click(function(){
        var activeLang = $('.lang-link.active-lang').attr('lang');
        var vid = activeLang == 'en' ? $trigger.attr('viden') : $trigger.attr('vidde');

        var player  = initPlayer(vid, vid);
        players[vid] = player;

        $('body').addClass('video-player-active');
        $('#' + wrapper).addClass('active');
        $.each(players, function(i,e){
          e.pause();
          $('#' + i).removeClass('active');
        });
        $('#' + vid).addClass('active');

        var elem = document.getElementById(vid);
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }

        if (window.matchMedia( "(min-width: 800px)" )) {
          players[vid].play();
        }
      });
    });

  }

  $('body').imagesLoaded( function() {
    initPlayers();
    initTriggers();
  });


  $('.video-controls .close').click(function(){
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
    setTimeout(function(){
      $('#' + $activePlayer.attr('parent'))
        .effect('shake')
        .addClass('fadeOut');
      removeStopped($('#' + $activePlayer.attr('parent')), $activePlayer);
    }, delay * 2);
  });


  // Controller jquery.
  $('#master-video-player').hover(function(){
    $(this).toggleClass('hover');
  }, function() {
    $(this).toggleClass('hover');
  });


});

