/*
** Released under GPL license v3.0
** http://www.gnu.org/licenses/gpl-3.0.txt
** 
** By Gagaro
*/

(function( $ ) {

    function bounce($this)
    {
	var data = $this.data('data');

	if (typeof data === 'undefined' || data.stop)
	    return ;

	var zone = $(data.settings.zone);

	var p = $this.offset();
	var pz = zone.offset();

	if (pz == null)
	{
	    pz = Object();
	    pz.left = 0;
	    pz.top = 0;
	}

	if (data.dirX < 0 && p.left - data.speedX < pz.left)
	    $this.data('data').dirX = 1;
	if (data.dirY < 0 && p.top - data.speedY < pz.top)
	    $this.data('data').dirY = 1;
	if (data.dirX > 0 && p.left + $this.width() + data.speedX
	    > zone.width() + pz.left)
	    $this.data('data').dirX = -1;
	if (data.dirY > 0 && p.top + $this.height() + data.speedY
	    > zone.height() + pz.top)
	    $this.data('data').dirY = -1;

	p.left = p.left + data.speedX * data.dirX;
	p.top = p.top + data.speedY * data.dirY;

	$this.offset(p);

	setTimeout(function() {bounce($this)}, data.settings.interval);
    }

    var methods = {
	start : function(options) {
	    var data = $(this).data('data');

	    if (typeof data !== 'undefined' && data.stop == false)
		return ;

	    var settings = $.extend( {
		'minSpeed'	: 2,
		'maxSpeed'	: 6,
		'interval'	: 20,
		'zone'		: window
	    }, options);

	    var dirX = Math.round(Math.random()),
	    dirY = Math.round(Math.random()),
	    speedX = Math.floor((Math.random()
				 * (settings.maxSpeed - settings.minSpeed))
				+ settings.minSpeed);
	    speedY = Math.floor((Math.random()
				 * (settings.maxSpeed - settings.minSpeed))
				+ settings.minSpeed);
	    if (dirX == 0)
		dirX = -1;
	    if (dirY == 0)
		dirY = -1;
	    
	    $(this).data('data', {
		'dirX' : dirX,
		'dirY' : dirY,
		'speedX' : speedX,
		'speedY' : speedY,
		'settings' : settings,
		'stop' : false
	    });

	    var p = $(this).position();

	    $(this).css('position', 'absolute')
		.css('left', p.left).css('top', p.top);

	    bounce($(this));

	    return $(this);
	},

	stop : function(options) {
	    $(this).data('data', {stop : true})
	}
    };

    $.fn.bounce = function(method) {
	if ( methods[method] ) {
	    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
	    return methods.init.apply( this, arguments );
	} else {
	    $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
	}   
    };
})( jQuery );