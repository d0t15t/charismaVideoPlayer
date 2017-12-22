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

    // Sides.
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
    var offsetTranslate = winSize.h * -0.1;
    var transform = transform += ' translate(0, ' + offsetTranslate + 'px)';
    var offsetScaling = 1.2;
    var transform = { transform: 'translate(0, ' + offsetTranslate + 'px)' };
    if ($(window).width() < 600) {
      transform.transform += ' scale('+ offsetScaling + ')';
    }

    $wrapper.css( transform );
  }


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
    var sep1 = ', ';
    var sep2 = ' ';
    var b = base;

    var r = 0.1;
    var x = b * r;
    var d = (b - x) / g.steps;
    var p = b / x / 100
    var o = 0; // offset
    // var n = 0; // new length
    for (var i = 0; i < g.steps; i++) {
      var path =
        'M' + o + sep1 + o + sep2 +
        'L' + b + sep1 + o + sep2 +
        'L' + b + sep1 + b + sep2 +
        'L' + o + sep1 + b + sep2 +
        'Z'
      ;
      // var path = coords.join();
      svg.path(path);
      var n = b - (d /2);
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

    if (offsetDir == 'top') {
      var offsetWithOffset = (offsetHalf / 5);
      var offset = ((offsetSideLength - baseSide) / 2) + offsetWithOffset + 'px';
      css[offsetDir] = offset;
    }
    else {
      var offset = ((offsetSideLength - baseSide) / 2) + 'px';
      css[offsetDir] = offset;
      css.transform = 'scale(1.3) translateY(-50px)';
    }
    $wr.css(css);


    $wr.find('svg path, svg line')
      .attr('stroke', '#ffffff')
      .attr('fill', 'none')
      .attr('stroke-width', '1');
  }
  function initSvgGrid_simple(base, direction) {
    $('#grid-svg').remove();
    var id = 'grid-svg';
    $('body').append('<div id="grid-svg"></div>');
    var $wr = $('#' + id);
    $wr.css({
      // 'width': base + 'px',
      'bottom' :'0'
    });
    $wr.css({
      'height': ($wr.height() + ($wr.height() / 7)) + 'px',
    });
    $wr.velocity({
      'opacity': 1
    }, {
      duration: 1000
    });
    if (window.innerWidth > window.innerHeight) {
    }




  }
  initGrid();
  initSvgGrid_simple(baseSide, direction);

  $(window).resize(function(){
    initGrid();
    initSvgGrid_simple(baseSide, direction);
  });

});