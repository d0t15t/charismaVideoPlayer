
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
  var d = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': jsonPath,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
  })();

  // Prepare scene elements
  var sE = d.sceneElements;
  var $wrapper = $('#grid-wrapper');
  var append = '<div class="vPlayer"><div class="thumbnail"></div></div>';

  for (var i = 0; i < sE.length; i++) {
    el = sE[i];
    $wrapper.append(append);
    $wrapper.children().last()
      .attr('id', el.videoId)
      .attr('vIndex', i);
    $wrapper.css({
      'background-image': el.thumbnail
    });

    var options = {
      id: el.videoId,
      width: 640,
      loop: true,
      byline: false,
      portrait: false,
      title: false,
    };
    player = new Vimeo.Player(el.videoId, options);

  }



});
