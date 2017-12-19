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

  // Home page set active link as default latest episode

  if (window.location.pathname == '/') {
    // console.log(d.e.releaseId);
    $('h2#page-title').text(d.e.title);
    $('#main-menu li').last().addClass('active-link');
    // eq(d.e.releaseId).addClass('active-link');
    console.log(d.e.releaseId);
  }

  // back button
  $('#prev-link').click(function(e){
    e.preventDefault();
    history.go(-1);
  });


});

