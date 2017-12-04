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
    'dev' : false,
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
  return 'white';
  // return array[Math.floor(Math.random()* array.length)];
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
  var $wrapper = gridInitWrapper($);
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
    var curZone = 0;
    var i = 0;
    for (i; i < steps; i++) {
      // Check and update segment.
      if (i >= segMax) {
        segMax = segMax + Math.round(steps / segments);
        curZone++;
      }
      $wrapper.append(insertDiv);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .attr('segment', i)
        .attr('zone', curZone)
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
    // gridDrawSides($wrapper, i + 1);

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
    var offsetTranslate = winSize.h * -0.1;
    var transform = transform += ' translate(0, ' + offsetTranslate + 'px)';
    var offsetScaling = 1.2;
    var transform = { transform: 'translate(0, ' + offsetTranslate + 'px)' };
    if ($(window).width() < 600) {
      transform.transform += ' scale('+ offsetScaling + ')';
    }

    $wrapper.css( transform );
  }
  initGrid();

  function initSvgGrid(base, direction) {
    var id = 'grid-svg';
    $('body').append('<div id="grid-svg"></div>');
    var $wr = $('#' + id);
    $wr.css({
      'width': base + 'px',
      'height': base + 'px',
    });
    var g = gridData();
    var svg = SVG(id);
    svg.viewbox(0, 0, base, base);
    var sep = ',';
    var b = base;

    var r = 0.1;
    var h = b * r;
    var d = (b - h) / g.steps;
    var p = b / h / 100
    var o = 0; // offset
    var n = 0; // new length
    for (var i = 0; i < g.steps; i++) {
      var coords = [
        'M' + o + sep + o,
        'L' + b + sep + o,
        'L' + b + sep + b,
        'L' + o + sep + b,
        'z'
      ];
      var path = coords.join();
      svg.path(path);
      n = b - (d /2);
      o += (b - n);
      b = n;
    }

    var $last = $wr.find('path').last();
    var t = $last.offset().top
    var l = $last.offset().left
    var w = $last.width();
    var h = $last.height();

    o -= (d/ 2);
    var sides = 4;

    var l1 = w / g.sideSteps;
    var l2 = base / g.sideSteps;

    for (var i = 0; i < sides; i++) {
      var dir = i % 2 == 0 ? 'x' : 'y';
      for (var j = 0; j <= 10; j++) {
        var lineData = [];
        var l1x = l1 * j;
        var l2x = l2 * j;
        switch (i) {
          case 0:
            lineData = [
              o + l1x, o, 0 + l2x, 0
            ];
            svg.line(lineData);
            break;
          case 1:
            lineData = [
              o + w, o + l1x, $wr.width() , 0 + l2x
            ];
            svg.line(lineData);
            break;
          case 2:
            lineData = [
              o + w - l1x, o + w, $wr.width() - l2x, $wr.height()
            ];
            break;
          case 3:
            lineData = [
              o, o + w - l1x, 0, $wr.height() - l2x
            ];
            break;
          }
        svg.line(lineData);
      }
    }

        /**
     * Offset centering
     */
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offsetSideLength = direction == 'horizontal' ? $(window).width() : $(window).height();
    var offsetHalf = ((offsetSideLength - baseSide) / 2); // this centers the middle
    var css = {};
    console.log(direction)
    if (offsetDir == 'top') {
      var offsetWithOffset = (offsetHalf / 5);
      var offset = ((offsetSideLength - baseSide) / 2) + offsetWithOffset + 'px';
      css[offsetDir] = offset;
    }
    else {
      var offset = ((offsetSideLength - baseSide) / 2) + 'px';
      css[offsetDir] = offset;
      css['transform'] = 'scale(1.3) translateY(-50px)';
    }
    $wr.css(css);


    $wr.find('svg path, svg line')
      .attr('stroke', 'yellow')
      .attr('fill', 'none')
      .attr('stroke-width', '1');
  }
  initSvgGrid(baseSide, direction);


});