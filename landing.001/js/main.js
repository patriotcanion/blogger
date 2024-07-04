/*=============================================
    =            Stone Script            =
=============================================*/
const bb_information = {
	product: {name: 'Bổ não QA Gingko Biloba', price: 250000, options: true},
	options: {
		regular: {quantity: 1, percent: 20.4},
		popular: {quantity: 3, percent: 30},
		special: {quantity: 6, percent: 36}
	},
	discount: {active: true, minimumOrder: 500000, percent: 15},
	shipping: {active: true, baseShipCost: 20000, minimumOrder: 300000, percent: 15}
}


const bb_productName = document.querySelector('#form-shopping-product > span');
const bb_productPrice = document.querySelector('#form-shopping-price > span');
const bb_quantitySelection = document.querySelector('#form-shopping-quantity > span');
const bb_seekedQuantity = bb_quantitySelection.querySelector('input');
const bb_priceActualCost = document.querySelector('#form-shopping-actualCost > span');
const bb_priceDiscount = document.querySelector('#form-shopping-discount > span');
const bb_priceShipCost = document.querySelector('#form-shopping-shipCost > span');
const bb_pricelastCost = document.querySelector('#form-shopping-lastCost > span');

bb_productName.textContent = bb_information.product.name;
let bb_tempNode = document.createElement('small');
bb_tempNode.innerHTML = `Đơn trên ${BB_numberWithCommas(bb_information.shipping.minimumOrder-1000, 0)}<sup>đ</sup> miễn phí vận chuyển, giảm thêm ${bb_information.shipping.percent}% cho đơn trên ${BB_numberWithCommas(bb_information.discount.minimumOrder-1000, 0)}`;
bb_productName.after(bb_tempNode);
bb_productPrice.innerHTML = BB_numberWithCommas(bb_information.product.price, 0) + '<sup>đ</sup>';

BB_sumTotal(bb_seekedQuantity.value);


let bb_quantityCounter = parseInt(bb_seekedQuantity.value, 10);

bb_quantitySelection.querySelector('button:nth-last-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	bb_quantityCounter++;
	bb_seekedQuantity.value = bb_quantityCounter;
	BB_sumTotal(bb_quantityCounter);
});

bb_quantitySelection.querySelector('button:nth-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	if (bb_seekedQuantity.value > 0) bb_quantityCounter--;
	bb_seekedQuantity.value = bb_quantityCounter;
	BB_sumTotal(bb_quantityCounter);
});

bb_seekedQuantity.addEventListener('input', (event) => {
	event.preventDefault();
	bb_quantityCounter = bb_seekedQuantity.value;
	BB_sumTotal(bb_quantityCounter);
});


const bb_contactName = document.querySelector('#bb-form-contact-name > input');
const bb_contactPhone = document.querySelector('#bb-form-contact-phone > input');
const bb_contactAddress = document.querySelector('#bb-form-contact-address > input');
const bb_contactMessage = document.querySelector('#bb-form-contact-message > textarea');
const bb_formSubmission = document.querySelector('input.contact-form-button.contact-form-button-submit');
const bb_notification = document.querySelector('p.contact-form-error-message');

// Check name, phone, address
const bb_requiredNodes = [bb_contactName, bb_contactPhone, bb_contactAddress];
const bb_requiredMatcher = [];

bb_requiredNodes.forEach((item, index) => {
	item.addEventListener('input', (event) => {
		event.preventDefault();
		let bb_variable;
		// Generate caustion notes
		if(index === 0){
			bb_variable = item.value.length > 0;
			bb_notification.textContent = 'Tên khách hàng đang bị bỏ trống';
		}else if(index === 1){
			bb_variable = item.value.length === 10;
			bb_notification.textContent = 'Số điện thoại chưa đúng (10 số)';
			item.value = item.value.replace(/\D+/g, '');
			item.setAttribute('maxlength', '10');
		}else{
			bb_variable = item.value.length >= 15;
			bb_notification.textContent = 'Thông tin phải chứa 15 ký tự trở lên';
		}
		// Generate caustion color
		if(bb_variable){
			bb_requiredMatcher[index] = 1;
			item.style.cssText = 'background-color: none';
			bb_notification.textContent = '';
		}else{
			bb_requiredMatcher[index] = 0;
			item.style.cssText = 'background-color: #F2CAC8';
		}
		// Once required information mathes true
		const bb_status = bb_requiredMatcher.reduce((product, value) => {return product*value});
		if(bb_status){
			const bb_breaker = '\n\n'+'-'.repeat(50)+'\n\n';
			document.querySelector('textarea.contact-form-email-message').textContent =
				`${bb_productName.textContent}\nSố lượng: ${bb_seekedQuantity.value} hộp\n` +
				`Phải thu: ${bb_pricelastCost.textContent}\nPhí v.chuyển: ${bb_priceShipCost.textContent}${bb_breaker}` +
				`Tên khách: ${bb_contactName[0].value}\nĐiện thoại: ${bb_contactPhone[0].value}\nĐịa chỉ: ${bb_contactAddress[1].value}${bb_breaker}` +
				`${bb_contactMessage[2].value}`;
			document.querySelector('input.contact-form-email').value = 'mail@mail.mail';
			bb_formSubmission.disabled = false;
		}else{
			bb_formSubmission.disabled = true;
		}
		// console.log(document.querySelector('textarea.contact-form-email-message').textContent);
	});
});


const bb_modal = document.querySelector('#bb-contact-form');
document.querySelectorAll('[data-bbOrderStart]').forEach(function(elem){
	elem.href = 'javascript:void(0)';
	elem.onclick = function (){bb_modal.style.cssText = 'display: flex; position: fixed'}
});
document.querySelector('[data-bbOrderClose]').onclick = function(){bb_modal.style.display = 'none'}
window.onclick = function(event) {if(event.target == bb_modal) bb_modal.style.display = 'none'}





function BB_sumTotal(_seekedQuantity){
	let _calculated = parseInt(_seekedQuantity, 10) * bb_information.product.price;
	let _discount = 0, _shipCost = 0;
	if(bb_information.discount.active){
		if(_calculated >= bb_information.discount.minimumOrder){
		_discount = _calculated * bb_information.discount.percent / 100;
		}
	}
	const _lastCost = _calculated - _discount;
	if(bb_information.shipping.active){
		if(_lastCost < bb_information.shipping.minimumOrder) _shipCost = bb_information.shipping.baseShipCost;
	}
	bb_priceActualCost.innerHTML = `${BB_numberWithCommas(_calculated, 1000)}<sup>đ</sup>`;
	bb_priceDiscount.innerHTML = `${BB_numberWithCommas(_discount, 1000)}<sup>đ</sup>`;
	bb_priceShipCost.innerHTML = `${BB_numberWithCommas(_shipCost, 1000)}<sup>đ</sup>`;
	bb_pricelastCost.innerHTML = `${BB_numberWithCommas(_lastCost + _shipCost, 1000)}<sup>đ</sup>`;
}


// function BB_itemQuantitySelector(_firstQuantity){
// 	let bb_quantityCounter = parseInt(bb_seekedQuantity.value, 10);

// 	bb_quantitySelection.querySelector('button:nth-last-child(1)').addEventListener('click', (event) => {
// 		event.preventDefault();
// 		bb_quantityCounter = bb_quantityCounter + _firstQuantity;
// 		bb_seekedQuantity.value = bb_quantityCounter;
// 		BB_sumTotal(bb_quantityCounter);
// 	});

// 	bb_quantitySelection.querySelector('button:nth-child(1)').addEventListener('click', (event) => {
// 		event.preventDefault();
// 		if (bb_seekedQuantity.value > 0) bb_quantityCounter = bb_quantityCounter - _firstQuantity;
// 		bb_seekedQuantity.value = bb_quantityCounter;
// 		BB_sumTotal(bb_quantityCounter);
// 	});

// 	bb_seekedQuantity.addEventListener('input', (event) => {
// 		event.preventDefault();
// 		bb_quantityCounter = bb_quantityCounter;
// 		BB_sumTotal(bb_quantityCounter);
// 	});
// }


function BB_numberWithCommas(_number, _round){
	if(Number.isInteger(_round) && _round > 0) _number = Math.round(_number/_round)*_round;
	return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}




if(bb_information.product.options){
	const bb_combosArea = document.querySelector('#pricing');
	const bb_productComboRegular = bb_combosArea.querySelector('.regular');
	const bb_productComboPopular = bb_combosArea.querySelector('.popular-plan');
	const bb_productComboSpecial = bb_combosArea.querySelector('.best-value-plan');
	const bb_infoOptions = Object.values(bb_information.options);

	[bb_productComboRegular, bb_productComboPopular, bb_productComboSpecial].forEach((element, index) => {
		const bb_eachComboPrice = bb_information.product.price * (100 - bb_infoOptions[index].percent) / 100;
		element.querySelector('.price').innerHTML = `${BB_numberWithCommas(bb_eachComboPrice, 1000)}`;
		element.querySelector('.total').innerHTML = `(Tổng ${BB_numberWithCommas(
			bb_eachComboPrice * bb_infoOptions[index].quantity, 1000
		)})`;
		element.querySelector('.save').innerHTML = `Giảm ${BB_numberWithCommas(bb_infoOptions[index].percent, 1)}%`;
	})
}













(function ($) {
	"use strict";

/*=============================================
	=    		 Preloader			      =
=============================================*/
function preloader() {
	$('#preloader').delay(0).fadeOut();
};

/*=============================================
	=          Windows OnLoad               =
=============================================*/
$(window).on('load', function () {
	preloader();
	mainSlider();
	wowAnimation();
});


/*=============================================
	=          One page Menu               =
=============================================*/
var scrollLink = $('.section-link');
// Active link switching
$(window).scroll(function () {
	var scrollbarLocation = $(this).scrollTop();

	scrollLink.each(function () {

		var sectionOffset = $(this.hash).offset().top - 90;

		if (sectionOffset <= scrollbarLocation) {
			$(this).parent().addClass('active');
			$(this).parent().siblings().removeClass('active');
		}
	});
});
//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
	$('a.section-link[href*="#"]:not([href="#"])').on('click', function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - 80)
				}, 1200, "easeInOutExpo");
				return false;
			}
		}
	});
});


/*=============================================
	=    		Mobile Menu			      =
=============================================*/
//SubMenu Dropdown Toggle
if ($('.menu-area li.menu-item-has-children ul').length) {
	$('.menu-area .navigation li.menu-item-has-children').append('<div class="dropdown-btn"><span class="fas fa-angle-down"></span></div>');

}

//Mobile Nav Hide Show
if ($('.mobile-menu').length) {

	var mobileMenuContent = $('.menu-area .main-menu').html();
	$('.mobile-menu .menu-box .menu-outer').append(mobileMenuContent);

	//Dropdown Button
	$('.mobile-menu li.menu-item-has-children .dropdown-btn').on('click', function () {
		$(this).toggleClass('open');
		$(this).prev('ul').slideToggle(500);
	});
	//Menu Toggle Btn
	$('.mobile-nav-toggler').on('click', function () {
		$('body').addClass('mobile-menu-visible');
	});

	//Menu Toggle Btn
	$('.menu-backdrop, .mobile-menu .close-btn, .mobile-menu .navigation li a').on('click', function () {
		$('body').removeClass('mobile-menu-visible');
	});
}


/*=============================================
	=          Data Background               =
=============================================*/
$(".header-btn a").on('click', function() {
    $('html, body').animate({
        scrollTop: $("#shop").offset().top
    }, 1200, "easeInOutExpo");
});


/*=============================================
	=          Data Background               =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})

/*=============================================
	=           Data Color             =
=============================================*/
$("[data-bg-color]").each(function () {
	$(this).css("background-color", $(this).attr("data-bg-color"));
});


/*=============================================
	=            Header Search            =
=============================================*/
$(".header-search > a").on('click', function () {
	$(".search-popup-wrap").slideToggle();
	$('body').addClass('search-visible');
	return false;
});

$(".search-backdrop").on('click', function () {
	$(".search-popup-wrap").slideUp(500);
	$('body').removeClass('search-visible');
});


/*=============================================
	=     Menu sticky & Scroll to top      =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#sticky-header").removeClass("sticky-menu");
		$('.scroll-to-target').removeClass('open');
		$("#header-top-fixed").removeClass("header-fixed-position");
		$("#header-fixed-height").removeClass("active-height");

	} else {
		$("#sticky-header").addClass("sticky-menu");
		$('.scroll-to-target').addClass('open');
		$("#header-top-fixed").addClass("header-fixed-position");
		$("#header-fixed-height").addClass("active-height");
	}
});


/*=============================================
	=    		 Scroll Up  	         =
=============================================*/
if ($('.scroll-to-target').length) {
  $(".scroll-to-target").on('click', function () {
    var target = $(this).attr('data-target');
    // animate
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);

  });
}


/*=============================================
	=          OffCanvas Active            =
=============================================*/
$('.navSidebar-button').on('click', function () {
	$('body').addClass('offcanvas-menu-visible');
	return false;
});

$('.offCanvas-overlay, .offCanvas-toggle').on('click', function () {
	$('body').removeClass('offcanvas-menu-visible');
});


/*=============================================
	=    		 Main Slider		      =
=============================================*/
function mainSlider() {
	var BasicSlider = $('.slider-active');
	BasicSlider.on('init', function (e, slick) {
		var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
		doAnimations($firstAnimatingElements);
	});
	BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
		var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
		doAnimations($animatingElements);
	});
	BasicSlider.slick({
		autoplay: false,
		autoplaySpeed: 10000,
		dots: false,
		fade: true,
		arrows: false,
		responsive: [
			{ breakpoint: 767, settings: { dots: false, arrows: false } }
		]
	});

	function doAnimations(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('delay');
			var $animationType = 'animated ' + $this.data('animation');
			$this.css({
				'animation-delay': $animationDelay,
				'-webkit-animation-delay': $animationDelay
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
		});
	}
}


/*=============================================
	=    		Brand Active		      =
=============================================*/
$('.brand-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: false,
	slidesToShow: 6,
	slidesToScroll: 2,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=    		Accordion Active		      =
=============================================*/
$(function () {
	$('.accordion-collapse').on('show.bs.collapse', function () {
		$(this).parent().addClass('active-item');
		$(this).parent().prev().addClass('prev-item');
	});

	$('.accordion-collapse').on('hide.bs.collapse', function () {
		$(this).parent().removeClass('active-item');
		$(this).parent().prev().removeClass('prev-item');
	});
});


/*=============================================
	=    		Shop Active		      =
=============================================*/
$('.home-shop-active').slick({
	dots: true,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: true,
	slidesToShow: 4,
	prevArrow: '<button type="button" class="slick-prev"><i class="flaticon-left-arrow"></i></button>',
	nextArrow: '<button type="button" class="slick-next"><i class="flaticon-right-arrow"></i></button>',
	slidesToScroll: 1,
	responsive: [
		{
		breakpoint: 1500,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
		breakpoint: 1200,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
		breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
		breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
			}
		},
		{
		breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=       Related Product Active      =
=============================================*/
$('.related-product-active').slick({
	dots: true,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: true,
	slidesToShow: 4,
	prevArrow: '<button type="button" class="slick-prev"><i class="flaticon-left-arrow"></i></button>',
	nextArrow: '<button type="button" class="slick-next"><i class="flaticon-right-arrow"></i></button>',
	slidesToScroll: 1,
	responsive: [
		{
		breakpoint: 1500,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
		breakpoint: 1200,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
		breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
		breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
			}
		},
		{
		breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=         Testimonial Active          =
=============================================*/
$('.testimonial-active').slick({
	dots: true,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: true,
	slidesToShow: 1,
	prevArrow: '<button type="button" class="slick-prev"><i class="flaticon-left-arrow"></i></button>',
	nextArrow: '<button type="button" class="slick-next"><i class="flaticon-right-arrow"></i></button>',
	slidesToScroll: 1,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
			breakpoint: 575,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});


/*=============================================
	=         Instagram Active          =
=============================================*/
$('.instagram-active').slick({
	dots: false,
	infinite: true,
	speed: 1000,
	autoplay: true,
	arrows: false,
	swipe: false,
	slidesToShow: 5,
	slidesToScroll: 1,
	responsive: [
		{
		breakpoint: 1200,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: true,
			}
		},
		{
		breakpoint: 992,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1
			}
		},
		{
		breakpoint: 767,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				arrows: false,
			}
		},
		{
		breakpoint: 575,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: false,
			}
		},
	]
});



/*=============================================
	=            Blog Active               =
=============================================*/
$('.blog-thumb-active').slick({
	dots: false,
	infinite: true,
	arrows: true,
	speed: 1500,
	slidesToShow: 1,
	slidesToScroll: 1,
	fade: true,
	prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-arrow-left"></i></button>',
	nextArrow: '<button type="button" class="slick-next"><i class="fas fa-arrow-right"></i></button>',
});


/*============================================
	=          Jarallax Active          =
=============================================*/
$('.jarallax').jarallax({
    speed: 0.2,
});


/*=============================================
	=    	   Paroller Active  	         =
=============================================*/
if ($('#paroller').length) {
	$('.paroller').paroller();
}


/*=============================================
	=    		Magnific Popup		      =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
		enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});


/*=============================================
	=    	 Slider Range Active  	         =
=============================================*/
$("#slider-range").slider({
	range: true,
	min: 20,
	max: 400,
	values: [120, 280],
	slide: function (event, ui) {
		$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
	}
});
$("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));


/*=============================================
	=          easyPieChart Active          =
=============================================*/
function easyPieChart() {
	$('.fact-item').on('inview', function (event, isInView) {
		if (isInView) {
			$('.chart').easyPieChart({
				scaleLength: 0,
				lineWidth: 6,
				trackWidth: 6,
				size: 70,
				lineCap: 'round',
				rotate: 360,
				trackColor: '#F4F4F4',
				barColor:'#FAA432',
			});
		}
	});
};
easyPieChart();


/*=============================================
	=         Cart Active           =
=============================================*/
$(".quickview-cart-plus-minus").append('<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>');
$(".qtybutton").on("click", function () {
	var $button = $(this);
	var oldValue = $button.parent().find("input").val();
	if ($button.text() == "+") {
		var newVal = parseFloat(oldValue) + 1;
	} else {
		// Don't allow decrementing below zero
		if (oldValue > 0) {
			var newVal = parseFloat(oldValue) - 1;
		} else {
			newVal = 0;
		}
	}
	$button.parent().find("input").val(newVal);
});


/*=============================================
	=    		Isotope	Active  	      =
=============================================*/
$('.grid').imagesLoaded(function () {
	// init Isotope
	var $grid = $('.grid').isotope({
		itemSelector: '.grid-item',
		percentPosition: true,
		masonry: {
			columnWidth: '.grid-item',
		}
	});
	// filter items on button click
	$('.portfolio-menu').on('click', 'button', function () {
		var filterValue = $(this).attr('data-filter');
		$grid.isotope({ filter: filterValue });
	});

});
//for menu active class
$('.product-license li').on('click', function (event) {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
	event.preventDefault();
});


/*=============================================
	=    		 Wow Active  	         =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}


})(jQuery);
