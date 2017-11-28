function makeNewPosition(){

  // Get viewport dimensions (remove the dimension of the div)
  var h = $(window).height() - 50;
  var w = $(window).width() - 50;

  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);

  return [nh,nw];

}

function animateDiv($el){
  var timeout = Math.floor(Math.random() * 6000) + 1;
  setTimeout(function(){
    var duration = Math.floor(Math.random() * 6000) + 1;
    var newq = makeNewPosition();
    var easing = 'swing';
    $el.animate({ top: newq[0], left: newq[1] }, duration, easing, function(){
      animateDiv($el);
    });
  }, timeout);

};
