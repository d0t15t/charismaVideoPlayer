var gridClassActive = 'grid-segment__border-active';
$(document).ready(function(){
  var g = gridData();

  // Grid Toggle
  var $wrapper = $('#grid-wrapper');
  $('#grid-activate-link input[type="checkbox"]').click(function(){
    $wrapper.toggleClass('grid-wrapper__active');
  });

  // BG toggle.
  $('#bg-toggle-link input[type="checkbox"]').click(function(){
    $('body').toggleClass('blue');
    $('#grid-wrapper').children().each(function(){
      if ($('body').hasClass('blue')) {
        $(this).css({
          'border': '1px solid white',
        });
        $(this).find('svg line').attr('stroke', 'white');
      }
      else {
        $(this).css({
          'border': '1px solid blue',
        });
        $(this).find('svg line').attr('stroke', 'blue');
      }
    });

  });

  // Zone toggle
  $('#zone-bg-toggle-link input[type="checkbox').click(function(){
    $('#grid-wrapper').toggleClass('bg-active');
  });

});

/**
 * Toggle grid view
 */
function toggleGridDisplay($grid, toggle = false, color) {
  var delay = 45;
  $grid.toggleClass('grid-wrapper__active');
}
