
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

  // Place scene elements
  placeSceneElements(d);

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

  var playButton = $('#scene-edit-form #play-scene a');

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
    // pause
  });
  // 'cuepoint'
  player.on('cuepoint', function(data){
    console.log(data.data.id + ' ' + data.data.action + ' at ' + data.time );
    switch(data.data.action) {
      case 'showElement':
          $('#' + data.data.id).addClass('active');
          if (d.playthrough == true)
            editFormSwitchActiveRow($('.scene#' + data.data.id));
          break;
      case 'hideElement':
        $('#' + data.data.id).removeClass('active');
        if (
          d.single.length > 0
          && d.single == data.data.id
        ){
          player.pause();
          playButton.toggleClass('active');
        }
        break;
    }
  });

  // Editor controls.
  var form = $('#scene-edit-form');
  function editFormSwitchActiveRow(target) {
    $.each(target.siblings(), function(i, e) {
      $(e).removeClass('active');
    });
    target.addClass('active');
    target.find('input').attr('checked', 'checked');
    $('#edits #posX').html(target.find('#posX').html())
    $('#edits #posX').attr('value', target.find('#posX').html())
    $('#edits #posY').html(target.find('#posY').html())
    $('#edits #posY').attr('value', target.find('#posY').html())
  }
  // switch active rows on click.
  form.find('input[name="scene-selector"]').click(function(){
    var target = $(this).parents('.' + $(this).attr('target'));
    editFormSwitchActiveRow(target);
    var id = target.attr('id');
    hideElements(d.sceneElements);
    $.each(d.sceneElements, function(i, e){
      if (e.id == id) {
        var curTime;
        curTime = e.time.in;
        player.setCurrentTime(e.time.in);
      }
    });
  });
  //prevent links default
  form.find('a').each(function(){
    $(this).click(function(event){
      event.preventDefault();
    });
  });

  // Play single scene.
  $('#scene-edit-form #play-scene a#play').click(function(event){
    var activeId = form.find('tr.active input[checked="checked"]').attr('value');
    console.log(activeId);
    d.single = activeId;
    d.playthrough = false;
    player.getCuePoints().then(function(cuePoints) {
      $.each(cuePoints, function(i, e) {
        if (
          e.data.action == 'showElement'
          && e.data.id == activeId
        ) {
          player.setCurrentTime(e.time);
          player.play();
          playbackSequence(d, e.time);
        }
      });
    });
  });


  $('#scene-edit-form a.time').click(function(event){
    var link = $(this);
    var activeId = form.find('tr.active input[checked="checked"]').attr('value');
    $.each(d.sceneElements, function(i, e){
      if (e.id == activeId) {
        var curTime;
        if (link.attr('id') == 'time-in')
          curTime = e.time.in;
        if (link.attr('id') == 'time-out')
          curTime = e.time.out;
        player.setCurrentTime(setTimeout);
      }
    });
  });

  // Edit scene element position.
  $('#scene-edit-form td.calc a').click(function(event){
    console.log('click')
    var link = $(this);
    var activeId = form.find('tr.active input[checked="checked"]').attr('value');
    var position = link.attr('target');
    var id = link.parent().attr('id');
    var target = $('tr#' + activeId + ' td#' + id);
    var editCell = $('#edits ' + '#' + id);
    var attr = editCell.attr('value');
    if (typeof attr !== typeof undefined && attr !== false) {
        // ...
    }
    var targetValue = parseInt(editCell.attr('value'));
    var value = parseInt(link.attr('value'));
    var newValue = (targetValue + value);
    $('#edits').addClass('active');
    $('#edits ' + '#' + id).html(targetValue + value).attr('value', newValue)
    console.log(position + ' ' + newValue + 'px');
    var sE = $('.scene-element#' + activeId);
    var asdf = 1;
    if (position == 'top') {
      sE.css({
        'top' : newValue + 'px'
      });
    }
    if (position == 'left') {
      sE.css({
        'left' : newValue + 'px'
      });
    }
  });

  /**
   * pause button.
   */
  $('#scene-edit-form #play-scene a#pause').click(function(event){
    player.pause();
  });

  /**
   * toggle active class
   */
  playButton.click(function(){
    $(this).parent().children('a').toggleClass('active');
  });

});

/**
 * Playback sequence.
 * @param {*} d
 * @param {*} curTime
 */
function playbackSequence(d, curTime) {
  console.log('playback sequence function');
  hideElements(d.sceneElements);
  showElements(getCurrentSE(d, curTime));
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


// Set to scene point.
function editorSetToScene(sE, activeId, time) {
  $.each(sE, function(i, e){
    if (e.id == activeId) {
      var curTime;
      if (link.attr('id') == 'time-in')
        curTime = e.time.in;
      if (link.attr('id') == 'time-out')
        curTime = e.time.out;
      player.setCurrentTime(setTimeout);
    }
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
        var radioIn = '<input type="radio" name="scene-selector" target="scene" value="';
        // var checked = (i == 0) ? 'checked="checked"' : null;
        var checked = null;
        var radioOut = '" ' + checked + '>';
        var file = '/' + d.episodeId + '/files/' + e.fileName;
        // var attrClasses = (i == 0) ? ' class="active scene"' : ' class="scene"';
        var attrClasses =' class="scene"';
        markup
        += '<tr' + attrClasses + ' id="' + e.id + '">'
          + '<td>' + radioIn + e.id + radioOut + e.id + '</td>'
          + '<td id="posX">' + e.position.x + '</td>'
          + '<td id="posY">' + e.position.y + '</td>'
          + '<td>' + e.time.in + '</td>'
          + '<td>' + e.time.out + '</td>'
          + '<td><img src="' + file + '"></td>'
        + '</tr>';
      });
      // Add playback button & info.
      markup
      += '<tr id="actions">'
        + '<td id="play-scene"><a id="play"class="playback active">Play</a><a id="pause" class="playback playing">Pause</a></td>'
        + '<td id="posX" class="calc"><a id="plus" value=1 target="left">+</a><a id="minus" value=-1 target="left">—</a></td>'
        + '<td id="posY" class="calc"><a id="plus" value=1 target="top">+</a><a id="minus" value=-1 target="top">—</a></td>'
        + '<td class="time"><a id="time-in" class="time">←</a></td>'
        + '<td class="time"><a id="time-out" class="time">→</a></td>'
      + '</tr>';
      // Edit info.
      markup
      += '<tr id="edits">'
        + '<td id="editId">Edits</td>'
        + '<td id="posX"><button id=posXbutton class="btn" data-clipboard-target="#posXbutton"></td>'
        + '<td id="posY"><button id=posYbutton class="btn" data-clipboard-target="#posYbutton"></td>'
      + '</tr>';
      // close markup
      markup += '</tr></table></form>';
    $('#' + d.infoId).append(markup);
  }
}
