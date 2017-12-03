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

  function initPlayers() {
    for (var i = 0; i < sE.length; i++) {
      var vid = sE[i].videoId;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid);
      $el.attr('id', vid).attr('parent', sE[i].id);
      var player  = initPlayer(vid, wrapper);
      players[vid] = player;

      var vid = sE[i].videoIdGerm;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid).attr('parent', sE[i].id);
      var player  = initPlayer(vid, wrapper);
      players[vid] = player;
    }
  }

  function initTriggers() {
    $('.scene-element').each(function(i, e){
      var $trigger = $(this);
      $trigger.click(function(){
        $('body').addClass('video-player-active');
        $('#' + wrapper).addClass('active');
        var activeLang = $('.lang-link.active-lang').attr('lang');
        var vid = activeLang == 'en' ? $trigger.attr('viden') : $trigger.attr('vidde');
        $.each(players, function(i,e){
          e.pause();
          $('#' + i).removeClass('active');
        });
        $('#' + vid).addClass('active');
        players[vid].play();
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
    var delay = 1000;
    function removeStopped($v, $p) {
      setTimeout(function(){
        $v.remove();
        $p.remove();
        $('.removeMe');
      }, delay);
    }
    console.log(activePlayerId);
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

