/**
 * @file grid.js
 */

/**
  * Grid data.
  */
function gridData() {
  return {
    'dev' : true,
    'id' : 'grid-wrapper',
    'mag' : 0.2,
    'segments': 25,
    'stepLength': 100, // in pixels
  };
}

$(document).ready(function(){

  /**
   * Init Grid
   */
  function initGrid() {

    var insertDiv = '<div></div>';
    var g = gridData();

    // Wrapper
    // The grid wrapper is a square, whose segment is the length of the shorter window side.
    $('body').append('<div></div>');
    var $wrapper = $('body').children().last();

    // Set up wrapper
    // Constants
    var steps = g.segments;
    var mag = g.mag;
    var winSize = {
      'w' : window.innerWidth, 'h' : window.innerHeight };
    var direction = (winSize.w > winSize.h) ? 'horizontal' : 'vertical';
    var baseSide = (winSize.w < winSize.h) ? winSize.w : winSize.h;

    $wrapper.attr('id', g.id);
    $wrapper.css({
      'height': baseSide,
      'width': baseSide,
    });

    // insertDiv segments

    for (var i = 0; i < steps; i++) {
      $wrapper.append(insertDiv);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .addClass('grid-segment');

      $el.css({
        'transform': 'scale(' + mag + ')'
      });
      // Update magnification.
      mag += mag / (steps - i);
    }

    /**
     *
     */
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offsetSideLength = direction == 'horizontal' ? winSize.w : winSize.h;
    var offset = ((offsetSideLength - baseSide) / 2) + 'px';
    var css = {};
    css[offsetDir] = offset;
    $wrapper.css(css);
    $wrapper.css({
      // 'margin-left': '340px'
    });

    // console.log(offsetDiffVal);
    console.log(css);



  }
  function gridDevData() {
    var g = gridData();
    var $grid = $(g.id);
    // insertDiv dev data.
    // $el.append(insertDiv);
    // var $dev = $el.children().last();
    // $dev.addClass('dev')

  }

  initGrid();


  // Screen
  var mq = window.matchMedia( "(min-width: 800px)" );
  if (mq.matches) {

  } else {
    console.log('not big enuf');
    // window width is less than 500px
  }
});