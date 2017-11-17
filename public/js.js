/**
 * Interface
 */
$(document).ready(function(){
  console.log('ready');
  /**
   *  @params
   *  1. path to json file
   *  2. css wrapper id for video player
   *  3. css wrapper id for scene elements
   *  4. css wrapper id for video info
   */
  var jsonPath = '/episode-test/data.json';
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

  d.playerId = playerId;
  d.elementsId = elementsId;
  d.infoId = infoId;
  d.playthrough = true;

  // Set scene indices.
  sElementsIndexing(d);

  // Init player.
  var options = {
    id: d.videoId,
    width: 640,
    loop: true,
    byline: false,
    portrait: false,
    title: false,
    autoplay: (d.autoplay == true)
  };
  player = new Vimeo.Player(d.playerId, options);



});
