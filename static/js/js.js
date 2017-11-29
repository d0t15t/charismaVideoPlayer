
/**
 * Interface
 */
$(document).ready(function(){
  /**
   *  @params
   *  1. path to json file
   *  2. css wrapper id for video player
   *  3. css wrapper id for scene elements
   *  4. css wrapper id for video info
   */
  var jsonPath = '/episode-test-2/data.json';
  var playerId = 'video-player';
  var elementsId = 'scene-elements';
  var infoId = 'video-info';

  // Load json data.
  // var d = (function () {
  //   var json = null;
  //   $.ajax({
  //       'async': false,
  //       'global': false,
  //       'url': jsonPath,
  //       'dataType': "json",
  //       'success': function (data) {
  //           json = data;
  //       }
  //   });
  //   return json;
  // })();

  // Prepare scene elements
  var data = episodeData();
  var sE = data.sceneElements;
  var players = {};
  var $wrapper = $('#scene-elements');
  var append = '<div class="scene-element"></div>';

  if (data.enable !== true) return;
  for (var i = 0; i < sE.length; i++) {
    var data = sE[i];
    // insert data container
    $wrapper.append(append);
    $wrapper.children().last()
      .attr('id', data.name)
      .attr('sIndex', i)
      .addClass(data.type);

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
        'cursor': 'pointer'
      });

    }

    // Init target data.
    if ('target' in data) {
      switch (data.target.type) {
        case 'video':
          var player = initMasterVideo(data.target);
          players[data.target.videoId] = player;
          $el.attr('vid', data.target.videoId)
          $el.addClass('video-trigger');
          break;
      }
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


function initMasterVideo(data, container = 'master-video-player') {
  var $container = $('#' + container);
  var init = document.getElementById(data.videoId);
  if (init == null) {
    $container.append('<div></div>');
    $container.children().last()
      .attr('id', data.videoId)
      .addClass('target-video');
  }
  var $wrapper = $('#' + data.videoId);
  var id = data.videoId;
  var options = {
    id: data.videoId,
    width: 640,
    loop: false,
    autoplay: false,
  };
  player = new Vimeo.Player(id, options);

  if ('volume' in data) {
    player.setVolume(data.volume);
  }

    // On finish, remove iframe
  player.on('ended', function(){
    $wrapper.removeClass('active');
  });

  return player;
}

