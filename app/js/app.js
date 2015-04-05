'use strict';

$(function () {
    FastClick.attach(document.body);
});

angular
    .module('deiCodebreak', [
		'proCanvas',
        'ampAccess'
    ])
    // The version is replaced on build and injected while running `gulp dev`.
    .value('appVersion', 'xxAppVersion')
    .run(function ($rootScope, appVersion) { $rootScope.appVersion = appVersion; })
    .config(function () {
        
        $(document)
            .on('touchstart', function (e) {
 
                var ignoredEl = $(e.target).closest('.allow-scroll-on-mobile');
                if( ignoredEl.length && e.originalEvent.touches.length === 1) {
 
                    ignoredEl.get(0)._lastClientY = e.originalEvent.touches[0].clientY;
                    e.target._ignoredEl = ignoredEl;
                }
            })
            .on('touchmove', function (e) {
 
                var ignoredEl = e.target._ignoredEl;
                if( ignoredEl && ignoredEl.length ) {
 
                    var ignoredNode = ignoredEl.get(0);
                    var ignoredElHeight = ignoredEl.outerHeight();
                    var isOverflowing = ignoredNode.scrollHeight > ignoredElHeight;
 
                    if( isOverflowing ) {
 
                        var touch = e.originalEvent.touches[0];
                        var scrollHeight = ignoredNode.scrollHeight;
                        var scrollTop = ignoredEl.scrollTop();
 
                        var UP = false;
                        var DOWN = true;
                        var moveDirection = ignoredNode._lastClientY > touch.clientY;
                        ignoredNode._lastClientY = touch.clientY;
 
                        var atBottom = (scrollTop === (scrollHeight - ignoredElHeight));
                        var atTop = scrollTop === 0;
 
                        if( !atTop && (moveDirection === UP) ) {
                            return;
                        }
 
                        if( !atBottom && (moveDirection === DOWN) ) {
                            return;
                        }
                    }
                }
 
                e.preventDefault();
                return false;
            });
    });
