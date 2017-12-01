var gridClassActive = 'grid-segment__border-active';
$(document).ready(function(){
  var g = gridData();

  var test = g.dev;
  var test = false;

  // Grid Toggle
  var $wrapper = $('#grid-wrapper');
  $('#grid-activate-link input[type="checkbox"]').click(function(){
    $wrapper.toggleClass('grid-wrapper__active');
    $('body').toggleClass('grid-active');

  });

  // Test
  if (test == true) {
    $('#grid-activate-link input[type="checkbox"]').prop('checked', true);
    $wrapper.toggleClass('grid-wrapper__active');
    $('body').toggleClass('grid-active');
  }

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


  // Zone segment toggle
  $('#zone-segmentbg-toggle-link input[type="checkbox').click(function(){
    $('body').toggleClass('placement-dev-wrapper-active');
  });

  // Zone toggle
  $('#zone-bg-toggle-link input[type="checkbox').click(function(){
    $('#grid-wrapper').toggleClass('bg-active');
  });

});

