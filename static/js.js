/**
 *  @params
 *  1. path to json file
 *  2. css wrapper id for video player
 *  3. css wrapper id for scene elements
 *  4. css wrapper id for video info
 */
var player = videoPlayer('/episode-test/data.json', 'video-player', 'scene-elements', 'video-info');

var timeOuts = [];

/**
 *  Initiate video player.
 * @param {*} jsonPath
 * @param {*} playerId
 * @param {*} elementsId
 * @param {*} infoId
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

    // Player on listener.
    player.on('play', function(playbackData) {
      player.getCurrentTime().then(function(curTime) {
        // Playback sequence
        playbackSequence(d, curTime);
      });
    });
    // Player pause listener.
    player.on('pause', function(playbackData){
      $.each(timeOuts, function(i, e){
        clearTimeout(e);
      });
    });

  });
}

/**
 * Playback sequence.
 * @param {*} d
 * @param {*} curTime
 */
function playbackSequence(d, curTime) {
  $.each(timeOuts, function(i, e){
    clearTimeout(e);
  });
  $.each(d.sceneElements, function(i, e){
    hideElement(e);
  });
  var sEcur  = getCurrentSE(d, curTime);
  // var sEnext = getNextSE(d, curTime, sEcur);

  // play current with offset stop time
  if (sEcur != null && sEcur.length > 0) {
    $.each(sEcur, function(i,e){
      var timeOffset = e.time.out - curTime;
      console.log(e.id);
      console.log(timeOffset);
      showElement(e);
      // var tO = setTimeout(function(){
      //   toggleElement(e);
      // }, timeOffset * 1000);
      // timeOuts.push(tO);
    });
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
 */
function toggleElement(el) {
  $('#' + el.id).toggleClass('active');
}

/**
 * Hide scene element.
 * @param {*} el
 */
function hideElement(el) {
  $('#' + el.id).removeClass('active');
}

/**
 * Show scene element.
 * @param {*} el
 */
function showElement(el) {
  $('#' + el.id).addClass('active');
}

/**
 * Get current scene element.
 * Check if a scene element is active based on current time. Elements which have passed,
 * or which begin later are not current.
 * @param {*} d
 * @param {*} curTime
 */
function getCurrentSE(d, curTime) {
  var array = [];
  for (i = 0 ;d.sceneElements[i];) {
    if (d.sceneElements[i].time.in <= curTime && d.sceneElements[i].time.out > curTime)
      array.push(d.sceneElements[i]);
    i++;
  }
  return array;
}

/**
 * Get next scene element.
 * @param {*} d
 * @param {*} curTime
 * @param {*} sEcur
 */
// function getNextSE(d, curTime, sEcur) {
//   // If current scene element is set, return next element.
//   if (sEcur != null && sEcur.length > 0 && sEcur.sceneIndex.length > 0)
//     return sEcur.sceneIndex.length + 1;
//   else {
//     // if no current element is set, calculate next element based on current time
//     // var i = 0;
//     for (i = 0 ;d.sceneElements[i];) {
//       if (d.sceneElements[i].time.in >= curTime && d.sceneElements[i].time.out > curTime) {
//         return d.sceneElements[i];
//       }
//       i++;
//     }
//   }
// }

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

