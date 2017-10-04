var timeOuts = [];
/**
 *  @params
 *  1. css wrapper id for video player
 *  2. css wrapper id for scene elements
 *  3. path to json file
 *  4. css wrapper id for video info
 */
function videoPlayer(jsonPath, playerId, elementsId, infoId) {
// $.playerInit = function(jsonPath, playerId, elementsId, infoId) {
  // Load json data.
  $.getJSON(jsonPath, { get_param: 'value' }, function(data) {
    var d = data;
    d.playerId = playerId;
    d.elementsId = elementsId;
    d.infoId = infoId;
    // Set scene indices.
    sElementsIndexing(d);
    // Place scene elements
    placeSceneElements(d);
    // Place dev info.
    placeSceneElementDevInfo(d);
    // player options
    var options = {
      id: d.videoId,
      width: 640,
      loop: true,
      byline: false,
      portrait: false,
      title: false,
    };
    // Initialize main player.
    var player = new Vimeo.Player(d.playerId, options);
    var curTime = 0;
    // More Dev settings.
    if (d.dev == true) {
      player.setVolume(0);
      player.play()
      // player.setCurrentTime(curTime);
    }

    //
    // Playback Sequence
    player.on('play', function(playbackData) {
      player.getCurrentTime().then(function(curTime) {
        // Playback sequence
        playbackSequence(d, curTime);
      });

    });

  });
}

function playbackSequence(d, curTime) {
  $.each(timeOuts, function(i, e){
    clearTimeout(e);
  });
  var sEcur  = getCurrentSE(d, curTime);
  var sEnext = getNextSE(d, curTime, sEcur);

  // play current with offset stop time
  if (sEcur != null) {
    var timeOffset = sEcur.time.out - curTime;
    toggleElement(sEcur);
    var tO = setTimeout(function(){
      toggleElement(sEcur);
    }, timeOffset * 1000);
    timeOuts.push(tO);
  }
  // Play sequence
  var i = sEcur ? sEcur.sceneIndex + 1 : 0;
  var asf = 1;
  $.each(d.sceneElements, function(i, e){
    var el = d.sceneElements[i];
    var timeOffsetStart = el.time.in - curTime;
    var timeOffsetEnd = el.time.out - curTime;
    var tO = setTimeout(function(){
      toggleElement(el);
    }, timeOffsetStart * 1000);
    timeOuts.push(tO);
    var tO = setTimeout(function(){
      toggleElement(el);
    }, timeOffsetEnd * 1000);
    timeOuts.push(tO);
  });
  // var playbackOffset

}

/**
 * Toggle class active on scene element.
 * @param {*} el
 * @param {*} toggle
 */
function toggleElement(el) {
  $('#' + el.id).toggleClass('active');
  var asdf = 1;
}

/**
 * Get current scene element.
 * Check if a scene element is active based on current time. Elements which have passed,
 * or which begin later are not current.
 * @param {*} d
 * @param {*} curTime
 */
function getCurrentSE(d, curTime) {
  for (i = 0 ;d.sceneElements[i];) {
    if (d.sceneElements[i].time.in <= curTime && d.sceneElements[i].time.out > curTime)
      return d.sceneElements[i];
    i++;
  }
}

/**
 * Get next scene element.
 * @param {*} d
 * @param {*} curTime
 * @param {*} sEcur
 */
function getNextSE(d, curTime, sEcur) {
  // If current scene element is set, return next element.
  if (sEcur != null && sEcur.length > 0 && sEcur.sceneIndex.length > 0)
    return sEcur.sceneIndex.length + 1;
  else {
    // if no current element is set, calculate next element based on current time
    // var i = 0;
    for (i = 0 ;d.sceneElements[i];) {
      if (d.sceneElements[i].time.in >= curTime && d.sceneElements[i].time.out > curTime) {
        return d.sceneElements[i];
      }
      i++;
    }
  }
}

/**
 * Set element indices.
 * @param {*} d
 */
function sElementsIndexing(d) {
  $.each(d.sceneElements, function(i, e){
    d.sceneElements[i].sceneIndex = i;
  });
}

/**
 * Place scene elements.
 */
function placeSceneElements(d) {
  $.each(d.sceneElements, function(i, e){
    var file = '/' + d.episodeId + '/files/' + e.fileName;
    var markup = '<div class="scene-element" id="' + e.id + '"><img src="' + file + '"></div>';
    $('#' + d.elementsId).append(markup)
    $('#' + e.id).css({
      'left': e.position.x,
      'top': e.position.y,
      'width': e.size.w,
      'height': e.size.h,
    });
  });
}

/**
 * Place scene element info
 */
function placeSceneElementDevInfo(d) {
  if (d.dev == true && d.sceneElements.length > 0) {
    var markup = '<table>';
    $.each(d.sceneElements, function(i, e) {
      markup += '<tr>';
      // Add table headers
      if (i == 0) {
        if (i == 0)
          markup += '<th></th>';
        $.each(e, function(ii, ee) {
          markup += '<th>' + ii + '</th>';
        });
      }
      markup += '</tr><tr>';
      // Add table cell data
      markup += '<td>' + (i + 1) + '</td>';
      $.each(e, function(ii, ee) {
        markup += '<td>' + ee + '</td>';
      });
      markup += '</tr><tr>';

      // Add playback button & info.
      markup += '<td colspan="8">' + 'play <div class="playback"></div>' + '</td>'; // play button
      markup += '</tr>';
    });
    markup += '</table>';
    $('#' + d.infoId).append(markup);
  }
}

function formatTime(t) {
  return t * 1000;
}

/**
 *  @params
 *  1. path to json file
 *  2. css wrapper id for video player
 *  3. css wrapper id for scene elements
 *  4. css wrapper id for video info
 */
var player = videoPlayer('/episode-test/data.json', 'video-player', 'scene-elements', 'video-info');