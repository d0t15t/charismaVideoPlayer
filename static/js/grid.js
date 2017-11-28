/**
 * @file grid.js
 */

/**
  * Create Grid.
  */
function gridData() {
  return {
    'dev' : true,
    'id' : 'grid-wrapper',
    'mag' : 0.2,
    'segments': 25,
    'stepLength': 100,
  }
}

$(document).ready(function(){

  /**
   * Init Grid
   */
  function initGrid() {
    // Data.
    var g = gridData();
    // Container.
    $('body').append('<div></div>');
    var $wrapper = $('body').children().last();
    // Constants
    var s = g.segments;
    var mag = g.mag;
    var win = {
      'w' : window.innerWidth,
      'h' : window.innerHeight
    }
    var direction = (win.w > win.h) ? 'horizontal' : 'vertical';
    var baseSide = (win.w > win.h) ? win.w : win.h;

    // Set up wrapper
    $wrapper.attr('id', g.id);
    $wrapper.css({
      'height': baseSide,
      'width': baseSide,
    });
    // Dynamic positioning.
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offset = (baseSide / 4) * -1 + 'px';
    var css = {};
    css[offsetDir] = offset;
    // $wrapper.css(css);

    console.log(css);

    var insert = '<div></div>';
    for (var i = 0; i < s; i++) {
      $wrapper.append(insert);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .addClass('grid-segment');

      $el.css({
        'transform': 'scale(' + mag + ')'
      });
      // Update magnification.
      mag += mag / (s - i);


    }

    console.log(s);
  }
  function gridDevData() {
    var g = gridData();
    var $grid = $(g.id);
    // Insert dev data.
    // $el.append(insert);
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