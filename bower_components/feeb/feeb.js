!function () {
    $.fn.feeb = function () {
        // Add scroll forzen time when using touch simulate click
        var isScroll = false,
            timeoutTimer;

        $(window).on('scroll', function () {
            // 标识为出于滚动冷冻期
            isScroll = true;
            // 清除上次滚动冷冻timer
            clearTimeout(timeoutTimer);

            timeoutTimer = setTimeout(function() {
                isScroll = false;
            }, 300);
        });

        var $con = this;
        /**
         *   touch feedback
         */
        $con.on('touchstart .feeb-on', function(event) {

            var $tar = _is(event.target, '.feeb-on', 5);
            if (!$tar) return;

            var backupEvent = event.targetTouches && event.targetTouches[0] ? event: null;
            
            var oevt = event.originalEvent || backupEvent,
                touches = oevt && oevt.targetTouches && oevt.targetTouches[0],
                pageX = touches ? touches['pageX'] : 0,
                pageY = touches ? touches['pageY'] : 0,
                endTouches,
                moveOevt,
                startScrollTop = document.body.scrollTop,
                endScrollTop = startScrollTop,
                endPageX = 0, 
                endPageY = 0;


            var isMove = false,
                isEnd = false,
                isFeed = false,
                delay = 40;

            function moveHandler(e) {
                backupEvent = e.targetTouches && e.targetTouches[0] ? e: null;

                moveOevt = e.originalEvent || backupEvent;
                endTouches = moveOevt && moveOevt.targetTouches && moveOevt.targetTouches[0];
                endPageX = endTouches ? endTouches['pageX'] : 0;
                endPageY = endTouches ? endTouches['pageY'] : 0;

                // 滚动了或者偏移超过5px都取消点击行为
                if ( Math.abs(pageX - endPageX) > 5 || Math.abs(pageY - endPageY) > 5 ) {
                    isMove = true;
                    $con.off('touchmove', moveHandler);
                    $tar.removeClass('touched');
                }
            }

            function endHandler(e) {
                isEnd = true;

                $tar.off('touchmove', moveHandler);
                $tar.off('touchend', endHandler);

                setTimeout(function() {
                    isFeed && $tar.removeClass('touched');
                }, 50);
            }
            $con.on('touchmove', moveHandler);
            $tar.on('touchend', endHandler);

            setTimeout(function() {
                if (isScroll) return;

                isFeed = true;

                if (!isMove) {
                    $con.find('.feeb-on.touched').removeClass('touched');
                    $tar.addClass('touched');
                }

                setTimeout(function() {
                    if (!isEnd) return;
                    isFeed = false;
                    $tar.removeClass('touched');
                }, 30);

            }, delay);
        });
    }

    /**
     *   jude a element if has specified selector
     */

    function _is(target, selector, times) {
        selector = selector.trim();
        if (times === undefined) times = 3;
        var $tar = $(target),
            $curtar = _parent($tar, times - 1, function($el) {
                if ($el.is(selector)) return true;
                else return false;
            });
        return $curtar;
    }
    /**
     *   search parent or ancestors element
     */
    function _parent(target, maxlevel, judge, _count) {
        var $tar = $(target);

        if (_count === undefined) _count = 0;
        /*search in bubbling*/
        if (!judge($tar) && _count >= maxlevel) {
            return null;
        } else if (judge($tar)) {
            return $tar;
        } else {
            _count++;
            return _parent.call(this, $tar.parent(), maxlevel, judge, _count);
        }
    }
}();


