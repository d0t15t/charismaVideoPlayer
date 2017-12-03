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
      var player  = initPlayer(vid, wrapper);
      players[vid] = player;

      var vid = sE[i].videoIdGerm;
      $wrapper.prepend('<div class="video-player"></div>');
      var $el = $wrapper.children().first();
      $el.attr('id', vid);
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


    // for (var i = 0; i < sE.length; i++) {

    //   // Click init & play for target videos.
    //   var $trigger = $('#' + sE[i].id);
    //   var trigger = sE[i];
    //   var elId = sE[i].id;
    //   $trigger.click(function(){
    //     $('body').addClass('video-player-active');
    //     $('#' + wrapper).addClass('active');
    //     var activeLang = $('.lang-link.active-lang').attr('lang');
    //     var vid = activeLang == 'en' ? trigger.videoId : trigger.videoIdGerm;

    //     console.log(elId);

    //     // $trigger.attr('vid', sE[i].videoId);
    //     // var vid = $(this).attr('vid');
    //     // Pause any active videos
    //     $.each(players, function(i,e){
    //       e.pause();
    //       $('#' + i).removeClass('active');
    //     });
    //     $('#' + vid).addClass('active');
    //     players[vid].play();
      // });
    // }
  }

  $('body').imagesLoaded( function() {
    initPlayers();
    initTriggers();
  });






  $('.video-controls .close').click(function(){
    $.each(players, function(i,e){
      e.pause();
    });
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

