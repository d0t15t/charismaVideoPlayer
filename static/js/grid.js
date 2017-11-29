/**
 * @file grid.js
 */

var winSize = {
  'w' : window.innerWidth, 'h' : window.innerHeight };
var direction = (winSize.w < winSize.h) ? 'horizontal' : 'vertical';
var baseSide = (winSize.w > winSize.h) ? winSize.w : winSize.h;
var gridClassActive = 'grid-segment__border-active';


/**
  * Grid data.
  */
function gridData() {
  return {
    'dev' : true,
    'id' : 'grid-wrapper',
    'segments': 20,
  };
}

/**
 *
 */
function borderColor() {
  var array = [
    'blue', 'orange', 'grey'
  ];
  return array[Math.floor(Math.random()* array.length)]
}

/**
 * Toggle grid view
 */
function toggleGridDisplay($grid, toggle = false, color) {
  var delay = 45;
  if (toggle == false) {
    $grid.children('.grid-segment').each(function(i){
      var el = $(this);
      setTimeout(function() {
        el.removeClass(gridClassActive);
      }, i * delay);
    });
  } else {
    $($grid.children('.grid-segment').get().reverse()).each(function(i){
      var $el = $(this);
      setTimeout(function() {
        $el.addClass(gridClassActive);
        $el.css({
          'border': '1px solid ' + color
        });
      }, i * delay);
    });
  }
}

$(document).ready(function(){

  /**
   * Init Grid
   */
  function initGrid() {

    var g = gridData();

    // Wrapper
    // The grid wrapper is a square, whose segment is the length of the shorter window side.
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

    // Set up wrapper
    // Constants
    $wrapper.css({
      'height': baseSide,
      'width': baseSide,
    });

    // insertDiv segments
    var steps = g.segments;
    var percentageStep = ((100) / steps) / 100;
    var scale = 1;
    var insertDiv = '<div></div>';
    var l = baseSide;
    var offset = 0;
    for (var i = 0; i < steps; i++) {
      $wrapper.append(insertDiv);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .addClass('grid-segment');
      var css = {
        'width' : l,
        'height' : l,
        'left' : offset,
        'top' : offset,
      };
      $el.css(css);
      // Update magnification.
      var n = l - (l * percentageStep) * 2;
      offset += (l - n) / 2;
      l = n;
      // if u want to use scale.
      // scale -= percentageStep;
      // 'transform': 'scale(' + scale + ')'


    }
    /**
     * Offset centering
     */
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offsetSideLength = direction == 'horizontal' ? winSize.w : winSize.h;
    var offset = ((offsetSideLength - baseSide) / 2) + 'px';
    var css = {};
    css[offsetDir] = offset;
    $wrapper.css(css);

    // Animate grid
    $('#grid-ctrl').click(function(){
      var toggle = $(this).find('input[type=checkbox]:checked').length > 0;
      toggleGridDisplay($wrapper, toggle, borderColor());
    });


    // console.log(css);

  }



  /**
   *
   */


  initGrid();


  // Screen
  var mq = window.matchMedia( "(min-width: 800px)" );
  if (mq.matches) {

  } else {
    console.log('not big enuf');
    // window width is less than 500px
  }
});