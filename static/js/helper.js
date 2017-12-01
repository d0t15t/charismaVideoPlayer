var gridClassActive = 'grid-segment__border-active';
$(document).ready(function(){
  var g = gridData();

  // Grid Toggle
  var $wrapper = $('#grid-wrapper');
  $('#grid-activate-link input[type="checkbox"]').click(function(){
    $wrapper.toggleClass('grid-wrapper__active');
  });
  // Test
  $('#grid-activate-link input[type="checkbox"]').prop('checked', true);
  $wrapper.toggleClass('grid-wrapper__active');

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

  // toggleGridDisplay($wrapper);

  // Zone toggle
  $('#zone-bg-toggle-link input[type="checkbox').click(function(){
    $('#grid-wrapper').toggleClass('bg-active');
  });

});

