/**
 * @file grid.js
 */

var winSize = {
  'w' : window.innerWidth, 'h' : window.innerHeight
};
var direction = (winSize.w < winSize.h) ? 'horizontal' : 'vertical';
var baseSide = (winSize.w > winSize.h) ? winSize.w : winSize.h;
var gridClassActive = 'grid-segment__border-active';
var g = gridData();

/**
  * Grid data.
  */
function gridData() {
  return {
    'dev' : true,
    'id' : 'grid-wrapper',
    'steps': 21,
    'segments': 4,
    'sideSteps': 10
  };
}

/**
 * Random border color
 */
function borderColor() {
  var array = [
    'white'
  ];
  return array[Math.floor(Math.random()* array.length)];
}


/**
 *
 */
function gridInitWrapper($) {
  var grid = document.getElementById(g.id);
  var $wrapper;
  if (grid == null) {
    $('body').append('<div></div>');
    $wrapper = $('body').children().last();
    $wrapper.attr('id', g.id);
  }
  else
    $wrapper = $(grid);
  if (g.dev == true) {
    $wrapper.addClass('dev');
  }

  return $wrapper;
}

function gridDrawSides($wrapper, index) {
  var $first = $wrapper.children().first();
  var $last = $wrapper.children().last();
  var w = ($first.outerWidth() / 2) - ($last.outerWidth() / 2);
  var h = ($first.outerHeight() / 2) - ($last.outerHeight() / 2);

  var sides = gridSidesData(w, h, $first, $last);

  $.each(sides, function(i, e){
    $wrapper.append('<div></div>');
    var $el = $wrapper.children().last();
    var id = i;
    $el.attr('id', id)
      .attr('s', 0)
      .addClass('grid-side')
      .css({
        'z-index': index * -1
      });
    index++;
    var draw = SVG(id);

    // draw.line(e.svgLine);
    var l1; var l2;
    if (e.dir == 'x') {
      l1 = $last.outerWidth();
      l2 = $first.outerWidth();
    }
    else {
      l1 = $last.outerHeight();
      l2 = $first.outerHeight();
    }
    l1 = l1 / g.sideSteps
    l2 = l2 / g.sideSteps
    for (var j = 0; j <= g.sideSteps; j++) {
      var lineData = [];
      var l1x = l1 * j;
      var l2x = l2 * j;
      if (e.dir == 'x') {
        lineData = [
          e.svgLine[0] + l1x, e.svgLine[1], e.svgLine[2] + l2x, e.svgLine[3]
        ];
      }
      else if (e.dir == 'y') {
        lineData = [
          e.svgLine[0], e.svgLine[1] + l1x, e.svgLine[2], e.svgLine[3] + l2x
        ];
      }
      draw.line(lineData);

    }
    $el.find('svg line').attr('stroke', 'white');
  });
}

function gridSidesData(w, h, $first, $last) {
  return {
    'top': {
      'dir': 'x',
      'svgLine': [
        w, h, $first.position().left, $first.position().top
      ],
    },
    'right': {
      'dir': 'y',
      'svgLine': [
        w + $last.outerWidth(), h, $first.outerWidth(), $first.position().top
      ],
    },
    'bottom': {
      'dir': 'x',
      'svgLine': [
        w, h + $last.outerHeight(), $first.position().left, $first.outerHeight()
      ],
    },
    'left': {
      'dir': 'y',
      'svgLine': [
        w, h, $first.position().left, $first.position().top
      ],
    },
  };
}

$(document).ready(function(){

  /**
   * Init Grid
   */
  function initGrid() {

    // Wrapper
    var $wrapper = gridInitWrapper($);
    $wrapper.css({
      'height': baseSide,
      'width': baseSide,
    });

    // insertDiv segments
    var steps = g.steps;
    var segments = g.segments;
    var percentageStep = ((100) / steps) / 100;
    var scale = 1;
    var insertDiv = '<div></div>';
    var l = baseSide;
    var offset = 0;
    var segMax = Math.round(steps / segments);
    var curSeg = 0;
    var i = 0;
    for (i; i < steps; i++) {
      // Check and update segment.
      if (i >= segMax) {
        segMax = segMax + Math.round(steps / segments);
        curSeg++;
      }
      $wrapper.append(insertDiv);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .attr('zone', curSeg)
        .addClass('grid-segment');
      var css = {
        'width' : l,
        'height' : l,
        'left' : offset,
        'top' : offset,
        'z-index': i * -1
      };
      $el.css(css);
      // Update magnification & length.
      var n = l - (l * percentageStep) * 2;
      offset += (l - n) / 2;
      l = n;

    }

    // Corners.
    gridDrawSides($wrapper, i + 1);

    /**
     * Offset centering
     */
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offsetSideLength = direction == 'horizontal' ? winSize.w : winSize.h;
    var offset = ((offsetSideLength - baseSide) / 2) + 'px';
    var css = {};
    css[offsetDir] = offset;
    $wrapper.css(css);

    /**
     * Offset Scaling
     */
    var offsetScaling = 1.13;
    var offsetTranslate = winSize.h * -0.1;
    $wrapper.css({
      'transform': 'translate(0, ' + offsetTranslate + 'px)'
      // 'transform': 'scale(' + offsetScaling + ') translate(0, -70px)'
    });

  }


  initGrid();



});