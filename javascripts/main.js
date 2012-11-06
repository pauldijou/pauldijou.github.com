jQuery(function() {
    jQuery("pre.prettyprint code").removeClass("prettyprint")
    .removeClass("linenums");
    prettyPrint();

    jQuery("[rel=tooltip]").tooltip();
    jQuery("[rel=tooltip-top]").tooltip({
        placement : 'top'
    });
    jQuery("[rel=tooltip-bottom]").tooltip({
        placement : 'bottom'
    });
    jQuery("[rel=tooltip-left]").tooltip({
        placement : 'left'
    });
    jQuery("[rel=tooltip-right]").tooltip({
        placement : 'right'
    });

    jQuery("a.anchorLink[href^=#]").anchorAnimate();
    jQuery(".toggleHide").toggleHide();

    jQuery(function() {
        var offset = jQuery(".follow-scroll").offset();
        if (offset != null) {
            var speed = 1100;
            jQuery(window).scroll(
                    function() {
                        if (jQuery(window).scrollTop() > offset.top) {
                            var marginTop = jQuery(window).scrollTop() - offset.top
                                    + getTopOffset();
                        } else {
                            var marginTop = 0;
                        }
                        ;
                        // console.log("Window.scrollTop :
                        // "+jQuery(window).scrollTop()+" - offset.top :
                        // "+offset.top+" + TopOffset : "+getTopOffset()+" =
                        // marginTop : "+marginTop);
                        jQuery(".follow-scroll").stop().animate({
                            marginTop : marginTop
                        }, speed);
                    });
        }
    });
});

jQuery.fn.anchorAnimate = function(settings) {

    settings = jQuery.extend({
        speed : 1100
    }, settings);

    return this.each(function() {
        var caller = this
        jQuery(caller).click(
                function(event) {
                    event.preventDefault()
                    var locationHref = window.location.href
                    var elementClick = jQuery(caller).attr("href")
                    var topOffset = getTopOffset();

                    var destination = jQuery(elementClick).offset().top
                            - getTopOffset();
                    // console.log("Link destination : "+destination + " -
                    // topOffset : "+getTopOffset());
                    jQuery("html:not(:animated),body:not(:animated)").animate({
                        scrollTop : destination
                    }, settings.speed);
                    return false;
                })
    })
}

jQuery.fn.toggleHide = function() {
    return this.each(function() {
        var caller = this
        jQuery(caller).click(function(event) {
            event.preventDefault();
            var selector = jQuery(caller).attr("data-selector");
            jQuery(selector).toggleClass("hide");
        })
    })
}

function getTopOffset() {
    // console.log(window.innerWidth);
    if (window.innerWidth > 979) {
        return 55;
    } else {
        return 5;
    }
}

function showProgress() {
    jQuery('#levels').addClass('show-progress');
    jQuery('#levels .btn-show-progression .btn-yes').addClass('active');
    jQuery('#levels .btn-show-progression .btn-no').removeClass('active');
}

function hideProgress() {
    jQuery('#levels').removeClass('show-progress');
    jQuery('#levels .btn-show-progression .btn-yes').removeClass('active');
    jQuery('#levels .btn-show-progression .btn-no').addClass('active');
}

(function(jQuery) {
    /**
     * Auto-growing textareas; technique ripped from Facebook
     * 
     * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
     */
    jQuery.fn.autogrow = function(options) {
        return this.filter('textarea').each(
                function() {
                    var self = this;
                    var jQueryself = jQuery(self);
                    var minHeight = jQueryself.height();
                    var noFlickerPad = jQueryself.hasClass('autogrow-short') ? 0
                            : parseInt(jQueryself.css('lineHeight'));

                    var shadow = jQuery('<div></div>').css({
                        position : 'absolute',
                        top : -10000,
                        left : -10000,
                        width : jQueryself.width(),
                        fontSize : jQueryself.css('fontSize'),
                        fontFamily : jQueryself.css('fontFamily'),
                        fontWeight : jQueryself.css('fontWeight'),
                        lineHeight : jQueryself.css('lineHeight'),
                        resize : 'none'
                    }).appendTo(document.body);

                    var update = function() {
                        var times = function(string, number) {
                            for ( var i = 0, r = ''; i < number; i++)
                                r += string;
                            return r;
                        };

                        var val = self.value.replace(/</g, '&lt;').replace(
                                />/g, '&gt;').replace(/&/g, '&amp;').replace(
                                /\njQuery/, '<br/>&nbsp;').replace(/\n/g, '<br/>')
                                .replace(
                                        / {2,}/g,
                                        function(space) {
                                            return times('&nbsp;',
                                                    space.length - 1)
                                                    + ' '
                                        });

                        shadow.css('width', jQueryself.width());
                        shadow.html(val);
                        jQueryself.css('height', Math.max(shadow.height()
                                + noFlickerPad, minHeight));
                    }

                    jQueryself.change(update).keyup(update).keydown(update);
                    jQuery(window).resize(update);

                    update();
                });
    };
})(jQuery);
