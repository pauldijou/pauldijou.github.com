$(document).ready(function() {
	$("[rel=tooltip]").tooltip();
	$("[rel=tooltip-top]").tooltip({placement: 'top'});
	$("[rel=tooltip-bottom]").tooltip({placement: 'bottom'});
	$("[rel=tooltip-left]").tooltip({placement: 'left'});
	$("[rel=tooltip-right]").tooltip({placement: 'right'});
	
	prettyPrint();
	
	$("a.anchorLink[href^=#]").anchorAnimate();
	$(".toggleHide").toggleHide();
	
	
	$(function() {
		var offset = $(".follow-scroll").offset();
		var speed = 1100;
		$(window).scroll(function() {
			if ($(window).scrollTop() > offset.top) {
				var marginTop = $(window).scrollTop() - offset.top + getTopOffset();
			} else {
				var marginTop = 0;
			};
			//console.log("Window.scrollTop : "+$(window).scrollTop()+" - offset.top : "+offset.top+" + TopOffset : "+getTopOffset()+" = marginTop : "+marginTop);
			$(".follow-scroll").stop().animate({marginTop: marginTop}, speed);
		});
	});
});

$.fn.anchorAnimate = function(settings) {

 	settings = jQuery.extend({
		speed : 1100
	}, settings);	
	
	return this.each(function(){
		var caller = this
		jQuery(caller).click(function (event) {	
			event.preventDefault()
			var locationHref = window.location.href
			var elementClick = jQuery(caller).attr("href")
			var topOffset = getTopOffset();
			
			var destination = jQuery(elementClick).offset().top - getTopOffset();
			//console.log("Link destination : "+destination + " - topOffset : "+getTopOffset());
			jQuery("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, settings.speed);
		  	return false;
		})
	})
}

$.fn.toggleHide = function() {
	return this.each(function() {
		var caller = this
		jQuery(caller).click(function (event) {	
			event.preventDefault();
			var selector = jQuery(caller).attr("data-selector");
			$(selector).toggleClass("hide");
		})
	})
}

function getTopOffset() {
	console.log(window.innerWidth);
	if(window.innerWidth > 979) {
		return 55;
	}
	else {
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

