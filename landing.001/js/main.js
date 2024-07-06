/*=============================================
  =            TẠO BẢNG ĐẶT HÀNG            =
=============================================*/

BB_preciousStone();

function BB_preciousStone(){

if(localStorage.getItem('everythingDone')) {
	localStorage.removeItem('everythingDone');
	return;
}

const bb_productData = {
	product: {name: 'Bổ não QA Gingko Biloba', price: 250000},
	options: {
		active: true,
		opt_01: {quantity: 1, percent: 20.4},
		opt_02: {quantity: 3, percent: 30},
		opt_03: {quantity: 6, percent: 36}
	},
	promotion: {active: true, minQuantity: 2, minOrderCost: 500000, percent: 15},
	shipping: {active: true, baseShipCost: 20000, minOrderCost: 300000, percent: 15}
}

const bb_productName = document.querySelector('#form-shopping-product > span');
const bb_productPrice = document.querySelector('#form-shopping-price > span');
const bb_productQuantityArea = document.querySelector('#form-shopping-quantity > span');
const bb_billQuantity = bb_productQuantityArea.querySelector('input');
const bb_billTotalCost = document.querySelector('#form-shopping-actualCost > span');
const bb_billPromoCost = document.querySelector('#form-shopping-discount > span');
const bb_billShipCost = document.querySelector('#form-shopping-shipCost > span');
const bb_billLastTotalCost = document.querySelector('#form-shopping-lastCost > span');

bb_productName.textContent = bb_productData.product.name;
let bb_tempNode = document.createElement('small');
bb_tempNode.innerHTML = `Đơn trên ${BB_numberDotSeparator(bb_productData.shipping.minOrderCost-1000, 0)}<sup>đ</sup> miễn phí vận chuyển, giảm thêm ${bb_productData.shipping.percent}% cho đơn trên ${BB_numberDotSeparator(bb_productData.promotion.minOrderCost-1000, 0)}`;
bb_productName.after(bb_tempNode);
bb_productPrice.innerHTML = BB_numberDotSeparator(bb_productData.product.price, 0) + '<sup>đ</sup>';

BB_priceEstimator(bb_billQuantity.value);


const bb_contactName = document.querySelector('#bb-form-contact-name > input');
const bb_contactPhone = document.querySelector('#bb-form-contact-phone > input');
const bb_contactAddress = document.querySelector('#bb-form-contact-address > input');
const bb_contactMessage = document.querySelector('#bb-form-contact-message > textarea');
const bb_formSubmission = document.querySelector('input.contact-form-button.contact-form-button-submit');
const bb_notification = document.querySelector('p.contact-form-error-message');

// Check name, phone, address
const bb_requiredMatcher = [];

[bb_contactName, bb_contactPhone, bb_contactAddress].forEach((item, index) => {
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
				`${bb_productName.textContent}\nSố lượng: ${bb_billQuantity.value} hộp\n` +
				`Phải thu: ${bb_billLastTotalCost.textContent}\nPhí v.chuyển: ${bb_billShipCost.textContent}${bb_breaker}` +
				`Tên khách: ${bb_contactName[0].value}\nĐiện thoại: ${bb_contactPhone[0].value}\nĐịa chỉ: ${bb_contactAddress[1].value}${bb_breaker}` +
				`${bb_contactMessage[2].value}`;
			document.querySelector('input.contact-form-email').value = 'mail@mail.mail';
			bb_formSubmission.disabled = false;
		}else{
			bb_formSubmission.disabled = true;
		}
	});
});


BB_landingPageDisplayer();


const bb_modal = document.querySelector('#bb-contact-form');
document.querySelectorAll('[data-bb-orderstart]').forEach(function(elem){
	elem.href = 'javascript:void(0)';
	elem.addEventListener('click', (event) => {
		event.preventDefault();
		BB_itemQuantitySelector(elem.dataset.bbOrderstart);
		bb_modal.style.cssText = 'display: flex; position: fixed';
	});
});
document.querySelector('[data-bb-orderclose]').onclick = function(){bb_modal.style.display = 'none'}
window.onclick = function(event) {if(event.target == bb_modal) bb_modal.style.display = 'none'}



/*=============================================
  =            TẠO HÀM CHỨC NĂNG            =
=============================================*/

function BB_priceEstimator(_seekedQuantity){
	let _calculated = parseInt(_seekedQuantity, 10) * bb_productData.product.price;
	let _promoCost = [], _lastTotalCost = 0, _shipCost = 0;

	if(bb_productData.promotion.active){
		if((_seekedQuantity >= bb_productData.promotion.minQuantity) ||
		(_calculated >= bb_productData.promotion.minOrderCost))
			_promoCost.push(_calculated * bb_productData.promotion.percent / 100);
	}

	if(bb_productData.options.active){
		let _percent = Object.values(bb_productData.options).map((value) => {
			if(_seekedQuantity >= value.quantity) return value.percent;
		});
		_percent = _percent.filter(Boolean);
		if(_percent.length) {
			_percent = _percent.reduce((prev, curr) => {return prev > curr ? prev : curr;});
			_promoCost.push(_calculated * _percent / 100);
		}
	};

	if(_promoCost.length){
		_promoCost = _promoCost.reduce((prev, curr) => {return prev.quantity < curr.quantity ? prev : curr;});
		_lastTotalCost = _calculated - _promoCost;
	}else{
		_promoCost = 0;
	}

	if(bb_productData.shipping.active){
		if(_lastTotalCost < bb_productData.shipping.minOrderCost) _shipCost = bb_productData.shipping.baseShipCost;
	}

	bb_billQuantity.value = _seekedQuantity;
	bb_productPrice.innerHTML = `${BB_numberDotSeparator(_lastTotalCost / _seekedQuantity, 1000)}<sup>đ</sup> \
		<s>${BB_numberDotSeparator(bb_productData.product.price, 1000)}<sup>đ</sup></s>`;
	bb_billTotalCost.innerHTML = `${BB_numberDotSeparator(_calculated, 1000)}<sup>đ</sup>`;
	bb_billPromoCost.innerHTML = `-${BB_numberDotSeparator(_promoCost, 1000)}<sup>đ</sup>`;
	bb_billShipCost.innerHTML = `${BB_numberDotSeparator(_shipCost, 1000)}<sup>đ</sup>`;
	bb_billLastTotalCost.innerHTML = `${BB_numberDotSeparator(_lastTotalCost + _shipCost, 1000)}<sup>đ</sup>`;
}


function BB_itemQuantitySelector(_firstQuantity){
	let bb_quantityCounter = parseInt(_firstQuantity, 10);
	if(!bb_quantityCounter) return;
	bb_billQuantity.value = bb_quantityCounter;

	BB_priceEstimator(bb_quantityCounter);

	bb_productQuantityArea.querySelector('button:nth-last-child(1)').addEventListener('click', (event) => {
		event.preventDefault();
		// bb_quantityCounter++;
		BB_priceEstimator(+bb_billQuantity.value + 1);
	});

	bb_productQuantityArea.querySelector('button:nth-child(1)').addEventListener('click', (event) => {
		event.preventDefault();
// 		if(bb_billQuantity.value > 1 && bb_quantityCounter > 1){
// console.log('first: ', bb_quantityCounter, bb_quantityCounter-1);
			// bb_quantityCounter--;
			// if(bb_billQuantity.value - )
// console.log('second: ', bb_quantityCounter);
			BB_priceEstimator(+bb_billQuantity.value - 1);
		}
	});

	bb_billQuantity.addEventListener('input', (event) => {
		event.preventDefault();
		bb_billQuantity.value = bb_billQuantity.value.replace(/\D+/g, '');
		BB_priceEstimator(bb_billQuantity.value);
	});
}

// Thêm dấu chắm phân chia hàng nghìn và làm tròn số tới 1000
function BB_numberDotSeparator(_number, _round){
	if(Number.isInteger(_round) && _round > 0) _number = Math.round(_number / _round) * _round;
	return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


//////////////////////////////////////////////////


function BB_landingPageContactAdder(){
	const bb_sellerContactData = {
		address: '24/1/2A2 Chương Dương, Trần Phú, Hải Dương',
		phone: '0857319366',
		zalo: {note: 'liên hệ qua zalo', url: 'https://zaloapp.com/qr/p/z29xq2umx020'},
		email: function(){const separate = window.location.host.split('.'); separate.shift(); return('hello@' + separate.join('.'));}
	}
	const bb_contactArea = document.querySelector('.footer-contact-wrap');

	if(!bb_contactArea) return;

	const bb_sellerAddress = bb_contactArea.querySelector('.address');
	const bb_sellerPhone = bb_contactArea.querySelector('.phone');
	const bb_sellerZalo = bb_contactArea.querySelector('.zalo');
	const bb_sellerEmail = bb_contactArea.querySelector('.mail');

	// bb_sellerAddress.innerHTML = bb_sellerAddress.innerHTML + ' ' + bb_sellerContactData.address;
	// bb_sellerPhone.innerHTML = bb_sellerPhone.innerHTML + ' 0' + BB_numberDotSeparator(bb_sellerContactData.phone.substring(1), 0);

	[bb_sellerPhone, bb_sellerZalo, bb_sellerEmail].forEach((item, index) => {
		item.addEventListener('click', function (event){
			event.preventDefault();
			if(index === 0) window.open('tel:+84' + bb_sellerContactData.phone);
			if(index === 1) window.open(bb_sellerContactData.zalo.url);
			if(index === 2) window.open('mailto:' + bb_sellerContactData.email());
		});
	});

	let bb_tempNode = document.createElement('style');
	bb_tempNode.textContent = `.footer-contact-wrap .address::after {content: "${bb_sellerContactData.address}";} \
	.footer-contact-wrap .phone::after {content: "0${BB_numberDotSeparator(bb_sellerContactData.phone.substring(1), 0)}";}\
	.footer-contact-wrap .zalo::after {content: "${bb_sellerContactData.zalo.note}";} \
	.footer-contact-wrap .mail::after {content: "${bb_sellerContactData.email()}";}`;
	bb_sellerAddress.before(bb_tempNode);
}

function BB_landingPageComboPrice(){
	const bb_combosArea = document.querySelector('#pricing');
	if(!bb_combosArea) return;

	const bb_infoOptions = Object.values(bb_productData.options);
	[bb_combosArea.querySelector('.regular'),
	bb_combosArea.querySelector('.popular-plan'), bb_combosArea.querySelector('.best-value-plan')
	].forEach((element, index) => {
		const bb_comboPrice = bb_productData.product.price * (100 - bb_infoOptions[index + 1].percent) / 100;
		element.querySelector('.price').innerHTML = `${BB_numberDotSeparator(bb_comboPrice, 1000)}`;
		element.querySelector('.total').innerHTML = `(Tổng ${BB_numberDotSeparator(
			bb_comboPrice * bb_infoOptions[index + 1].quantity, 1000
		)})`;
		element.querySelector('.save').innerHTML = `Giảm ${BB_numberDotSeparator(bb_infoOptions[index + 1].percent, 1)}%`;
		element.dataset.bbOrderstart = bb_infoOptions[index + 1].quantity;
	});
}


// Hiện mức giá từng combo lên trang chủ (landing page)
function BB_landingPageDisplayer(){
	BB_landingPageContactAdder();
	if(bb_productData.options.active) BB_landingPageComboPrice();
}

localStorage.setItem('everythingDone', true);

};



/*=============================================/=============================================*/

/*=============================================/=============================================*/


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
