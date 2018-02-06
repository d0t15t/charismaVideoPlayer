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
  var lang = window.navigator.userLanguage || window.navigator.language;
  if(window.location.hash) {
    lang = window.location.hash == '#de' ? 'de-DE' : 'en-GB';
  }
  menuLinksLanguageUpdate(lang);

  // Set active menu link based on browser language.
  if (germans.indexOf(lang) != -1) {
    $('#de-link').attr('active-link', '').addClass('active-link');
  }
  else
    $('#en-link').attr('active-link', '').addClass('active-link');
  $('#de-link, #en-link').each(function(){
    $(this).addClass('lang-link');
  });

  // Language menu controls.
  $('#de-link, #en-link').click(function(){
    $('#de-link, #en-link').removeClass('active-link');
    $(this).addClass('active-link');
    var lang = $(this).children().attr('lang');
    window.navigator.userLanguage = lang;
    window.navigator.language = lang;
    menuLinksLanguageUpdate(lang);
  });

  function menuLinksLanguageUpdate(lang) {
    var $links = $('#main-menu > li a');
    $links.each(function(){
      var $link = $(this);
      var link = $link.attr('href');
      // update hash value
      var index = link.indexOf('#');
      if ( index != -1) {
        link = link.slice(0, index);
      }
      var langShort = lang.substr(0, 2);
      $link.attr('href', link + '#' + langShort);
      window.location.hash = langShort;
    });
  }

  // Home page set active link as default latest episode
  if (window.location.pathname == '/') {
    $('h2#page-title').text(d.e.title);
    $('#main-menu li').first().addClass('active-link');
  }

  // back button
  $('#prev-link').click(function(e){
    e.preventDefault();
    history.go(-1);
  });

});

// if ((navigator.userAgent.match(/iPhone/)) || (navigator.userAgent.match(/iPod/))) {
//   alert("we've got an iDevice, Scotty");
// }

// if (navigator.userAgent.match(/Android/)) {
//   alert("Droid me baby");
// }