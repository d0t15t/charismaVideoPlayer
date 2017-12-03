+++
date = "2017-12-06T21:48:51-07:00"
title = "Episode 1: Miscommunication"
name = "fullscreen-launch"
+++

<div id="fullscreen-launch-content" class="center-page no-nav">
  <div class="inner">
    <div class="rounded-logo"></div>
      <div class="circle">
        <a href="/" >
      </div>
      <!-- <div class="rounded-enter"></div> -->
    </a>
    <a class="title" href="/" >
      <img src="/images/Episode-1-title.svg">
      <!-- <h1 class="headline-style-1">Episode 1: Miscommunication</h1> -->
    </a>
  </div>
</div>
<div id="launchpage-scrolling-text">
  <marquee direction="left">"No adult is an island."</marquee>
  <marquee direction="right">"What didn't you say?"</marquee>
  <!-- <marquee direction="left">"Got any coconuts in your backyard?"</marquee> -->
  <!-- <marquee direction="right">"Boom! And you're inside the mirror."</marquee> -->
</div>


<script src="https://code.jquery.com/jquery-3.1.1.min.js"   integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="   crossorigin="anonymous"></script>

<script>
$(document).ready(function(){

  var $el = $('#fullscreen-launch-content');
  // $el.hide();
  $el.css({
    'top':( $(window).height() / 2) - ($el.height() / 2)
  });



});

</script>