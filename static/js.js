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

    // player options
    var options = {
      id: d.videoId,
      width: 640,
      loop: true,
      byline: false,
      portrait: false,
      title: false,
      autoplay: (d.autoplay == true)
    };

    // Initialize main player.
    var player = new Vimeo.Player(d.playerId, options);

    // Dev settings.
    if (d.dev == true) {
      player.setVolume(0);
      // Place dev info.
      placeSceneElementDevInfo(d);
    }

    // Initialize cuepoints.
    $.each(d.sceneElements, function(i, e){
      player.addCuePoint(e.time.in, {
        action: 'showElement',
        id: e.id,
      });
      player.addCuePoint(e.time.out, {
        action: 'hideElement',
        id: e.id,
      });
    });

    // Event listeners.
    // 'play'
    player.on('play', function(data) {
      player.getCurrentTime().then(function(curTime) {
        // Playback sequence
        playbackSequence(d, curTime);
      });
    });

    // 'pause'
    player.on('pause', function(data){
      $.each(timeOuts, function(i, e){
        // clearTimeout(e);
      });
    });
    // 'cuepoint'
    player.on('cuepoint', function(data){
      console.log(data.data.id + ' ' + data.data.action + ' at ' + data.time );
      $('#' + data.data.id).toggleClass('active');
    });

  });
}

/**
 * Playback sequence.
 * @param {*} d
 * @param {*} curTime
 */
function playbackSequence(d, curTime) {
  hideElements(d.sceneElements);
  var sEcur  = getCurrentSE(d, curTime);
  showElements(sEcur);
}

/**
 * Toggle class active on scene element.
 * @param {*} el
 */
function toggleElement(el) {
  $('#' + el.id).toggleClass('active');
}

/**
 * Hide scene element(s).
 * @param {array} array
 */
function hideElements(array) {
  $.each(array, function(i, e) {
    $('#' + e.id).removeClass('active');
  });
}

/**
 * Show scene element(s).
 * @param {array} array
 */
function showElements(array) {
  $.each(array, function(i, e) {
    $('#' + e.id).addClass('active');
  });
}

/**
 * Get current scene element(s).
 * Check if a scene element is active based on current time. Elements which have passed,
 * or which begin later are not current.
 * @param {object} d
 * @param {decimal} curTime
 */
function getCurrentSE(d, curTime) {
  var array = [];
  for (i = 0; d.sceneElements[i];) {
    if (d.sceneElements[i].time.in < curTime && d.sceneElements[i].time.out > curTime)
      array.push(d.sceneElements[i]);
    i++;
  }
  return array;
}

/**
 * Set elements' indices as properties of the object.
 * @param {object} d
 */
function sElementsIndexing(d) {
  $.each(d.sceneElements, function(i, e){
    d.sceneElements[i].sceneIndex = i;
  });
}

/**
 * Place scene elements x/y in window.
 * @param {object} d
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
 * @param {object} d
 */
function placeSceneElementDevInfo(d) {
  if (d.dev == true && d.sceneElements.length > 0) {
    var markup = '<form id="scene-edit-form"><table>'
      + '<tr>'
        + '<th>ID</th>'
        + '<th>X</th>'
        + '<th>Y</th>'
        + '<th>In</th>'
        + '<th>Out</th>'
      + '</tr>';

      $.each(d.sceneElements, function(i, e) {
        var radioIn = '<input type="radio" name="scene-selector" value="';
        var checked = (i == 0) ? 'checked="checked"' : null;
        var radioOut = '" ' + checked + '>';
        markup
        += '<tr>'
          + '<td>' + radioIn + e.id + radioOut + e.id + '</td>'
          + '<td>' + e.position.x + '</td>'
          + '<td>' + e.position.y + '</td>'
          + '<td>' + e.time.in + '</td>'
          + '<td>' + e.time.out + '</td>'
        + '</tr>';
      });
      // Edit info.
      markup
      += '<tr id="edits">'
        + '<td id="editId">Edits</td>'
        + '<td id="posX"></td>'
        + '<td id="posY"></td>'
        + '<td id="timeIn"></td>'
        + '<td id="timeOut"></td>'
      + '</tr>';
      // Add playback button & info.
      markup
      += '<tr id="actions">'
        + '<td id="play-scene"><a>Play</a></td>'
        + '<td id="posX" class="calc"><a id="plus">+</a><a id="minus">—</a></td>'
        + '<td id="posY" class="calc"><a id="plus">+</a><a id="minus">—</a></td>'
      + '</tr>';
      // close markup
      markup += '</tr></table></form>';
    $('#' + d.infoId).append(markup);
  }
}
