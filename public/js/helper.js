var gridClassActive = 'grid-segment__border-active';
$(document).ready(function(){
  var g = gridData();

  var test = g.dev;

  // add Blue on main page
  if ($('body').find('.front-page').length > 0)
    $('body').addClass('blue');

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

  var germans = [
    'de-AT', 'de-DE', 'de-LI', 'de-LU', 'de-CH',
  ];
  var lng = window.navigator.userLanguage || window.navigator.language;
  if (germans.indexOf(lng) != -1) {
    $('#de-link').attr('active-lang', '');
  }
  else {
      $('#en-link').addClass('active-lang');
  }

    console.log('this');
  $('#main-menu').click(function(){
    'lang click';
  });

  // $.each(langLinks, function(){
  //   $(this).click(function(){
  //     console.log('lang');
  //   })
  // });



});

