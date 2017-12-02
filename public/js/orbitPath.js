function orbitPath(svgWrapperId, objectId) {
  var path = 'M150 0 L75 200 L225 200 Z',
    firstWalkerObj = $('#' + objectId)[0],
    walkers = [];

  // handles whatever moves along the path
  function AnimateWalker(walker){
    this.pathAnimator = new PathAnimator( path, {
      duration : 3,
      step     : this.step.bind(this),
      reverse  : false,
      onDone   : this.finish.bind(this)
    });

    this.walker = walker;
  }

  AnimateWalker.prototype = {
    start : function(){
      this.startOffset = (this.reverse || this.speed < 0) ? 500 : 0; // if in reversed mode, then animation should start from the end, I.E 100%
      this.pathAnimator.start();
    },

    // Execute every "frame"
    step : function(point, angle){
      var stretchFactor = 5,
        scale = this.pathAnimator.percent < 50 ? this.pathAnimator.percent : 50 - (this.pathAnimator.percent - 50);

      scale = (scale/30) + 0.5;

      this.walker.style.cssText = "top:" + point.y * stretchFactor + "px;" +
                    "left:" + point.x * stretchFactor + "px;" +
                    "transform:rotate(" + angle + "deg) scale("+ scale +");";
    },

    // Restart animation once it was finished
    finish : function(){
      this.start();
    },

    // Resume animation from the last completed percentage (also updates the animation with new settings' values)
    resume : function(){
      this.pathAnimator.start( this.speed, this.step, this.reverse, this.pathAnimator.percent, this.finish, this.easing);
    }
  }

  function generateWalker(walkerObj){
    var newAnimatedWalker = new AnimateWalker( walkerObj );
    walkers.push(newAnimatedWalker);
    return newAnimatedWalker;
  }

  // start "animating" the first Walker on the page
  generateWalker(firstWalkerObj).start();
  // bind the first Controller to the first Walker
  var firstController = $('menu > div:first');
  firstController.data( 'walker', walkers[0] );
}

function orbitSvg1() {
  var svg =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<svg width="602px" height="602px" viewBox="0 0 602 602" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
          '<path d="M284.22057,0.793708639 C284.22057,0.793708639 -38.2544436,-7.26523962 4.99083195,327.624651 C48.2361075,662.514542 567.102154,595.252699 567.102154,595.252699 C567.102154,595.252699 623.734098,545.979677 590.599647,520.652322 C557.465195,495.324967 647.046166,89.6625644 497.639816,68.4372624 C348.233467,47.2119603 284.22057,0.793708639 284.22057,0.793708639 Z" id="Path-2" stroke="#979797"></path>' +
      '</g>' +
  '</svg>';
  return svg;
}
function orbitPath1() {
  return 'M284.22057,0.793708639 C284.22057,0.793708639 -38.2544436,-7.26523962 4.99083195,327.624651 C48.2361075,662.514542 567.102154,595.252699 567.102154,595.252699 C567.102154,595.252699 623.734098,545.979677 590.599647,520.652322 C557.465195,495.324967 647.046166,89.6625644 497.639816,68.4372624 C348.233467,47.2119603 284.22057,0.793708639 284.22057,0.793708639 Z';
}