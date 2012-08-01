$(function() {
    var test = '#{site.default_page_title}';
    
    $("[rel=tooltip]").tooltip();
    $("[rel=tooltip-top]").tooltip({
        placement : 'top'
    });
    $("[rel=tooltip-bottom]").tooltip({
        placement : 'bottom'
    });
    $("[rel=tooltip-left]").tooltip({
        placement : 'left'
    });
    $("[rel=tooltip-right]").tooltip({
        placement : 'right'
    });

    $("pre.prettyprint code").removeClass("prettyprint")
            .removeClass("linenums");
    prettyPrint();

    $("a.anchorLink[href^=#]").anchorAnimate();
    $(".toggleHide").toggleHide();

    $(function() {
        var offset = $(".follow-scroll").offset();
        if (offset != null) {
            var speed = 1100;
            $(window).scroll(
                    function() {
                        if ($(window).scrollTop() > offset.top) {
                            var marginTop = $(window).scrollTop() - offset.top
                                    + getTopOffset();
                        } else {
                            var marginTop = 0;
                        }
                        ;
                        // console.log("Window.scrollTop :
                        // "+$(window).scrollTop()+" - offset.top :
                        // "+offset.top+" + TopOffset : "+getTopOffset()+" =
                        // marginTop : "+marginTop);
                        $(".follow-scroll").stop().animate({
                            marginTop : marginTop
                        }, speed);
                    });
        }
    });
});

$.fn.anchorAnimate = function(settings) {

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

$.fn.toggleHide = function() {
    return this.each(function() {
        var caller = this
        jQuery(caller).click(function(event) {
            event.preventDefault();
            var selector = jQuery(caller).attr("data-selector");
            $(selector).toggleClass("hide");
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
    $('#levels').addClass('show-progress');
    $('#levels .btn-show-progression .btn-yes').addClass('active');
    $('#levels .btn-show-progression .btn-no').removeClass('active');
}

function hideProgress() {
    $('#levels').removeClass('show-progress');
    $('#levels .btn-show-progression .btn-yes').removeClass('active');
    $('#levels .btn-show-progression .btn-no').addClass('active');
}

(function($) {
    /**
     * Auto-growing textareas; technique ripped from Facebook
     * 
     * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
     */
    $.fn.autogrow = function(options) {
        return this.filter('textarea').each(
                function() {
                    var self = this;
                    var $self = $(self);
                    var minHeight = $self.height();
                    var noFlickerPad = $self.hasClass('autogrow-short') ? 0
                            : parseInt($self.css('lineHeight'));

                    var shadow = $('<div></div>').css({
                        position : 'absolute',
                        top : -10000,
                        left : -10000,
                        width : $self.width(),
                        fontSize : $self.css('fontSize'),
                        fontFamily : $self.css('fontFamily'),
                        fontWeight : $self.css('fontWeight'),
                        lineHeight : $self.css('lineHeight'),
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
                                /\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>')
                                .replace(
                                        / {2,}/g,
                                        function(space) {
                                            return times('&nbsp;',
                                                    space.length - 1)
                                                    + ' '
                                        });

                        shadow.css('width', $self.width());
                        shadow.html(val);
                        $self.css('height', Math.max(shadow.height()
                                + noFlickerPad, minHeight));
                    }

                    $self.change(update).keyup(update).keydown(update);
                    $(window).resize(update);

                    update();
                });
    };
})(jQuery);
