// First two dependencies, jquery.event.drag.js and
// jquery.mousewheel.js, we put them inline here to save people the
// effort of downloading them.
/* Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.2
 * 
 * Requires: 1.2.2+
 */
(function(c){var a=["DOMMouseScroll","mousewheel"];c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var d=a.length;d;){this.addEventListener(a[--d],b,false)}}else{this.onmousewheel=b}},teardown:function(){if(this.removeEventListener){for(var d=a.length;d;){this.removeEventListener(a[--d],b,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(d){return d?this.bind("mousewheel",d):this.trigger("mousewheel")},unmousewheel:function(d){return this.unbind("mousewheel",d)}});function b(f){var d=[].slice.call(arguments,1),g=0,e=true;f=c.event.fix(f||window.event);f.type="mousewheel";if(f.wheelDelta){g=f.wheelDelta/120}if(f.detail){g=-f.detail/3}d.unshift(f,g);return c.event.handle.apply(this,d)}})(jQuery);/* 
jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt
*/
(function(e){e.fn.drag=function(l,k,j){if(k){this.bind("dragstart",l)}if(j){this.bind("dragend",j)}return !l?this.trigger("drag"):this.bind("drag",k?k:l)};var a=e.event,b=a.special,f=b.drag={not:":input",distance:0,which:1,dragging:false,setup:function(j){j=e.extend({distance:f.distance,which:f.which,not:f.not},j||{});j.distance=i(j.distance);a.add(this,"mousedown",h,j);if(this.attachEvent){this.attachEvent("ondragstart",d)}},teardown:function(){a.remove(this,"mousedown",h);if(this===f.dragging){f.dragging=f.proxy=false}g(this,true);if(this.detachEvent){this.detachEvent("ondragstart",d)}}};b.dragstart=b.dragend={setup:function(){},teardown:function(){}};function h(l){var k=this,j,m=l.data||{};if(m.elem){k=l.dragTarget=m.elem;l.dragProxy=f.proxy||k;l.cursorOffsetX=m.pageX-m.left;l.cursorOffsetY=m.pageY-m.top;l.offsetX=l.pageX-l.cursorOffsetX;l.offsetY=l.pageY-l.cursorOffsetY}else{if(f.dragging||(m.which>0&&l.which!=m.which)||e(l.target).is(m.not)){return}}switch(l.type){case"mousedown":e.extend(m,e(k).offset(),{elem:k,target:l.target,pageX:l.pageX,pageY:l.pageY});a.add(document,"mousemove mouseup",h,m);g(k,false);f.dragging=null;return false;case !f.dragging&&"mousemove":if(i(l.pageX-m.pageX)+i(l.pageY-m.pageY)<m.distance){break}l.target=m.target;j=c(l,"dragstart",k);if(j!==false){f.dragging=k;f.proxy=l.dragProxy=e(j||k)[0]}case"mousemove":if(f.dragging){j=c(l,"drag",k);if(b.drop){b.drop.allowed=(j!==false);b.drop.handler(l)}if(j!==false){break}l.type="mouseup"}case"mouseup":a.remove(document,"mousemove mouseup",h);if(f.dragging){if(b.drop){b.drop.handler(l)}c(l,"dragend",k)}g(k,true);f.dragging=f.proxy=m.elem=false;break}return true}function c(m,k,l){m.type=k;var j=e.event.handle.call(l,m);return j===false?false:j||m.result}function i(j){return Math.pow(j,2)}function d(){return(f.dragging===false)}function g(k,j){if(!k){return}k.unselectable=j?"off":"on";k.onselectstart=function(){return j};if(k.style){k.style.MozUserSelect=j?"":"none"}}})(jQuery);/* Flot plugin for adding the ability to pan and zoom the plot.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The default behaviour is double click and scrollwheel up/down to zoom in, drag
to pan. The plugin defines plot.zoom({ center }), plot.zoomOut() and
plot.pan( offset ) so you easily can add custom controls. It also fires
"plotpan" and "plotzoom" events, useful for synchronizing plots.

The plugin supports these options:

	zoom: {
		interactive: false
		trigger: "dblclick" // or "click" for single click
		amount: 1.5         // 2 = 200% (zoom in), 0.5 = 50% (zoom out)
	}

	pan: {
		interactive: false
		cursor: "move"      // CSS mouse cursor value used when dragging, e.g. "pointer"
		frameRate: 20
	}

	xaxis, yaxis, x2axis, y2axis: {
		zoomRange: null  // or [ number, number ] (min range, max range) or false
		panRange: null   // or [ number, number ] (min, max) or false
	}

"interactive" enables the built-in drag/click behaviour. If you enable
interactive for pan, then you'll have a basic plot that supports moving
around; the same for zoom.

"amount" specifies the default amount to zoom in (so 1.5 = 150%) relative to
the current viewport.

"cursor" is a standard CSS mouse cursor string used for visual feedback to the
user when dragging.

"frameRate" specifies the maximum number of times per second the plot will
update itself while the user is panning around on it (set to null to disable
intermediate pans, the plot will then not update until the mouse button is
released).

"zoomRange" is the interval in which zooming can happen, e.g. with zoomRange:
[1, 100] the zoom will never scale the axis so that the difference between min
and max is smaller than 1 or larger than 100. You can set either end to null
to ignore, e.g. [1, null]. If you set zoomRange to false, zooming on that axis
will be disabled.

"panRange" confines the panning to stay within a range, e.g. with panRange:
[-10, 20] panning stops at -10 in one end and at 20 in the other. Either can
be null, e.g. [-10, null]. If you set panRange to false, panning on that axis
will be disabled.

Example API usage:

	plot = $.plot(...);

	// zoom default amount in on the pixel ( 10, 20 )
	plot.zoom({ center: { left: 10, top: 20 } });

	// zoom out again
	plot.zoomOut({ center: { left: 10, top: 20 } });

	// zoom 200% in on the pixel (10, 20)
	plot.zoom({ amount: 2, center: { left: 10, top: 20 } });

	// pan 100 pixels to the left and 20 down
	plot.pan({ left: -100, top: 20 })

Here, "center" specifies where the center of the zooming should happen. Note
that this is defined in pixel space, not the space of the data points (you can
use the p2c helpers on the axes in Flot to help you convert between these).

"amount" is the amount to zoom the viewport relative to the current range, so
1 is 100% (i.e. no change), 1.5 is 150% (zoom in), 0.7 is 70% (zoom out). You
can set the default in the options.

*/

(function ($) {
    var options = {
        xaxis: {
            zoomRange: null, // or [number, number] (min range, max range)
            panRange: null // or [number, number] (min, max)
        },
        zoom: {
            interactive: false,
            trigger: "dblclick", // or "click" for single click
            amount: 1.5 // how much to zoom relative to current position, 2 = 200% (zoom in), 0.5 = 50% (zoom out)
        },
        pan: {
            interactive: false,
            cursor: "move",
            frameRate: 20
        }
    };

    function init(plot) {
        function onZoomClick(e, zoomOut) {
            var c = plot.offset();
            c.left = e.pageX - c.left;
            c.top = e.pageY - c.top;
            if (zoomOut)
                plot.zoomOut({ center: c });
            else
                plot.zoom({ center: c });
        }

        function onMouseWheel(e, delta) {
            e.preventDefault();
            onZoomClick(e, delta < 0);
            return false;
        }
        
        var prevCursor = 'default', prevPageX = 0, prevPageY = 0,
            panTimeout = null;

        function onDragStart(e) {
            if (e.which != 1)  // only accept left-click
                return false;
            var c = plot.getPlaceholder().css('cursor');
            if (c)
                prevCursor = c;
            plot.getPlaceholder().css('cursor', plot.getOptions().pan.cursor);
            prevPageX = e.pageX;
            prevPageY = e.pageY;
        }
        
        function onDrag(e) {
            var frameRate = plot.getOptions().pan.frameRate;
            if (panTimeout || !frameRate)
                return;

            panTimeout = setTimeout(function () {
                plot.pan({ left: prevPageX - e.pageX,
                           top: prevPageY - e.pageY });
                prevPageX = e.pageX;
                prevPageY = e.pageY;
                                                    
                panTimeout = null;
            }, 1 / frameRate * 1000);
        }

        function onDragEnd(e) {
            if (panTimeout) {
                clearTimeout(panTimeout);
                panTimeout = null;
            }
                    
            plot.getPlaceholder().css('cursor', prevCursor);
            plot.pan({ left: prevPageX - e.pageX,
                       top: prevPageY - e.pageY });
        }
        
        function bindEvents(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.zoom.interactive) {
                eventHolder[o.zoom.trigger](onZoomClick);
                eventHolder.mousewheel(onMouseWheel);
            }

            if (o.pan.interactive) {
                eventHolder.bind("dragstart", { distance: 10 }, onDragStart);
                eventHolder.bind("drag", onDrag);
                eventHolder.bind("dragend", onDragEnd);
            }
        }

        plot.zoomOut = function (args) {
            if (!args)
                args = {};
            
            if (!args.amount)
                args.amount = plot.getOptions().zoom.amount;

            args.amount = 1 / args.amount;
            plot.zoom(args);
        };
        
        plot.zoom = function (args) {
            if (!args)
                args = {};
            
            var c = args.center,
                amount = args.amount || plot.getOptions().zoom.amount,
                w = plot.width(), h = plot.height();

            if (!c)
                c = { left: w / 2, top: h / 2 };
                
            var xf = c.left / w,
                yf = c.top / h,
                minmax = {
                    x: {
                        min: c.left - xf * w / amount,
                        max: c.left + (1 - xf) * w / amount
                    },
                    y: {
                        min: c.top - yf * h / amount,
                        max: c.top + (1 - yf) * h / amount
                    }
                };

            $.each(plot.getAxes(), function(_, axis) {
                var opts = axis.options,
                    min = minmax[axis.direction].min,
                    max = minmax[axis.direction].max,
                    zr = opts.zoomRange,
                    pr = opts.panRange;

                if (zr === false) // no zooming on this axis
                    return;
                    
                min = axis.c2p(min);
                max = axis.c2p(max);
                if (min > max) {
                    // make sure min < max
                    var tmp = min;
                    min = max;
                    max = tmp;
                }

                //Check that we are in panRange
                if (pr) {
                    if (pr[0] != null && min < pr[0]) {
                        min = pr[0];
                    }
                    if (pr[1] != null && max > pr[1]) {
                        max = pr[1];
                    }
                }

                var range = max - min;
                if (zr &&
                    ((zr[0] != null && range < zr[0] && amount >1) ||
                     (zr[1] != null && range > zr[1] && amount <1)))
                    return;
            
                opts.min = min;
                opts.max = max;
            });
            
            plot.setupGrid();
            plot.draw();
            
            if (!args.preventEvent)
                plot.getPlaceholder().trigger("plotzoom", [ plot, args ]);
        };

        plot.pan = function (args) {
            var delta = {
                x: +args.left,
                y: +args.top
            };

            if (isNaN(delta.x))
                delta.x = 0;
            if (isNaN(delta.y))
                delta.y = 0;

            $.each(plot.getAxes(), function (_, axis) {
                var opts = axis.options,
                    min, max, d = delta[axis.direction];

                min = axis.c2p(axis.p2c(axis.min) + d),
                max = axis.c2p(axis.p2c(axis.max) + d);

                var pr = opts.panRange;
                if (pr === false) // no panning on this axis
                    return;
                
                if (pr) {
                    // check whether we hit the wall
                    if (pr[0] != null && pr[0] > min) {
                        d = pr[0] - min;
                        min += d;
                        max += d;
                    }
                    
                    if (pr[1] != null && pr[1] < max) {
                        d = pr[1] - max;
                        min += d;
                        max += d;
                    }
                }
                
                opts.min = min;
                opts.max = max;
            });
            
            plot.setupGrid();
            plot.draw();
            
            if (!args.preventEvent)
                plot.getPlaceholder().trigger("plotpan", [ plot, args ]);
        };

        function shutdown(plot, eventHolder) {
            eventHolder.unbind(plot.getOptions().zoom.trigger, onZoomClick);
            eventHolder.unbind("mousewheel", onMouseWheel);
            eventHolder.unbind("dragstart", onDragStart);
            eventHolder.unbind("drag", onDrag);
            eventHolder.unbind("dragend", onDragEnd);
            if (panTimeout)
                clearTimeout(panTimeout);
        }
        
        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'navigate',
        version: '1.3'
    });
})(jQuery);
