define(function(require, exports, module) {
    'use strict';

    var util = require('util/utils');
    
    var ui = {

        config: {
            onClass: 'tui-on',
        },
        // feedback events initialize
        init: function () {
            this.button();
        },
        // feedback listen
        button: function () {
            var _this  = this;

            /**
             *   touch feedback
             */
            $(document).on('touchstart .tui-btn,.tui-com', function (event) {
                var $tar = util.is(event.target, '.tui-btn') || util.is(event.target, '.tui-com');
                if (!$tar) return;

                $('body').off('touchmove', scrollHandler);
                $tar.off('touchend', endHandler);

                // 滚动列表不可以取消默认行为
                if ($tar.data('noclick') == 'true') {
                  event.preventDefault();
                }

                var isSroll = false,
                    isEnd = false,
                    isFeed = false,
                    isMoveInit = false,
                    delay = 50;

                function scrollHandler (e) {
                  // touchstart trigger with touchmove
                  isSroll = true;
                  $('body').off('touchmove', scrollHandler);
                  $tar.removeClass(_this.config.onClass);
                }
                function endHandler (e) {
                  isEnd = true;
                  $tar.off('touchend', endHandler);

                  if (isSroll) $tar.removeClass(_this.config.onClass);

                  setTimeout(function () {
                    isFeed && $tar.removeClass(_this.config.onClass);
                  }, 50);
                }
                $('body').on('touchmove', scrollHandler);
                $tar.on('touchend', endHandler);

                setTimeout(function () {
                  isFeed = true;
                  !isSroll && $tar.addClass(_this.config.onClass);
                  if (!isEnd) return;

                  setTimeout(function () {
                    $tar.removeClass(_this.config.onClass);
                  }, 50);

                }, delay);
            });

            return this;
        }
    };

    module.exports = ui;
});