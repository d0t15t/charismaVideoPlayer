var gridClassActive = 'grid-segment__border-active';
$(document).ready(function(){
  var g = gridData();

  var test = g.dev;
  var grid = true;

  setTimeout(function(){
    $('header').addClass('active');
  }, 600);

  // Grid Toggle
  // @todo: toggle is disabled.
  var $wrapper = $('#grid-svg');
  var $wrapper2 = $('#grid-wrapper');
  // $('#grid-activate-link input[type="checkbox"]').click(function(){
  //   $wrapper.toggleClass('active');
  //   $wrapper2.toggleClass('active');
  //   $('body').toggleClass('grid-active');

  // });

  // Test
  if (grid == true) {
    $('#grid-activate-link input[type="checkbox"]').prop('checked', true);
    $wrapper.toggleClass('active');
    $wrapper2.toggleClass('active');
    setTimeout(function(){
      $('body').toggleClass('grid-active');
    }, 500);
  }

  // BG toggle.
  $('#bg-toggle-link input[type="checkbox"]').click(function(){
    $('body').toggleClass('blue');
    $('#grid-wrapper, #grid-svg').children().each(function(){
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
  $('#zone-segmentbg-toggle-link input[type="checkbox"]').click(function(){
    $('body').toggleClass('placement-dev-wrapper-active');
  });

  // Zone toggle
  $('#zone-bg-toggle-link input[type="checkbox"]').click(function(){
    $('#grid-wrapper').toggleClass('bg-active');
  });

  var germans = [
    'de-AT', 'de-DE', 'de-LI', 'de-LU', 'de-CH',
  ];
  var lng = window.navigator.userLanguage || window.navigator.language;

  if (germans.indexOf(lng) != -1) {
    $('#de-link').attr('active-link', '');
  }
  else
    $('#en-link').addClass('active-link');
  $('#de-link, #en-link').each(function(){
    $(this).attr('lang', $(this).attr('id').replace('-link', '')).addClass('lang-link');
  });
  $('#de-link, #en-link').click(function(){
    $('#de-link, #en-link').removeClass('active-link');
    $(this).addClass('active-link');
  });


  $('header.header').click(function(){
    $(this).toggleClass('clear');
  });


});

