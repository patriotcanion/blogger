/*=============================================
    =            Stone Script            =
=============================================*/

(function (){
	const bb_contactFormDom = '<style>\
		:root{--width:320px;--fontSize:16px}\
		#bb-contact-form{display:none;position:absolute;z-index:100;left:0;top:0;justify-content:center;align-items:center;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4)}\
		#ContactForm1{font-size:var(--fontSize);width:375px;padding-top:35px;padding-bottom:35px;margin:auto;background-color:#F7F6F4}\
		#ContactForm1 .contact-form-widget{width:var(--width);margin:auto}\
		#ContactForm1 .title{display:none;width:var(--width);margin:10px auto 35px auto;font-size:30px;font-weight:300}\
		button,input[inputmode=numeric],input[type=text],textarea{font-family:inherit;font-size:var(--fontSize);border:none;outline:#E59802}\
		button,*[data-control]{cursor:pointer}\
		fieldset{border:none;padding:unset;margin-bottom:25px!important}\
		label{display:inline-block;width:120px}\
		#form-shopping-product>span{display:inline-block;width:100%;font-size:19px;font-weight:700;line-height:1.5;word-space:-2px}\
		#form-shopping-product>small{font-weight:500;color:#0c80e3;margin-top:10px;display:inline-block;font-size:14px}\
		input.bb-form-control{margin-left:10px;float:right;background-color:#ED6B5B}\
		input.bb-form-control:hover{background-color:#575A6D}\
		#form-shopping-quantity>span{display:inline-flex;border-radius:10px;overflow:hidden;border:1px solid #5e99f6}\
		#form-shopping-quantity>span>button{outline:0;padding:10px 15px;width:40px}\
		#form-shopping-quantity>span>input{text-align:center;width:45px;padding:10px;background-color:#f8f8f8}\
		#form-shopping-quantity>span>button{color:#5e99f6;background-color:#fff}\
		#form-shopping-quantity>span>button:hover{background-color:#e6e6e6}\
		#form-shopping-lastCost{font-weight:700}\
		#form-contact-email,#form-contact-message,#form-contact-name{display:none}\
		#ContactForm1_contact-form-submit,#bb-form-contact-address>input,#bb-form-contact-message>textarea,#bb-form-contact-name>input,#bb-form-contact-phone>input{width:var(--width);border:1px solid #5e99f6;border-radius:4px;height:42px;padding:8px 15px;line-height:1.5;margin:auto;display:block;box-sizing:border-box}\
		#bb-form-contact-message>textarea{height:100px;resize:none}\
		#ContactForm1_contact-form-submit,.bb-form-control{color:#fff;font-weight:700;width:150px;height:48px;border-radius:30px;font-size:var(--fontSize);text-transform:uppercase;background-color:#3786C9;border:none;display:inline-block}\
		#ContactForm1_contact-form-submit:hover,.bb-form-control:hover{background-color:#B4C640}\
		#form-notification>p{width:var(--width);color:#F2CAC8;display:initial}\
	</style>\
	<b:section id="bb-contact-form" class="main" showaddelement="yes">\
		<b:widget id="ContactForm1" locked="false" title="Thông tin đơn hàng" type="ContactForm" version="2" visible="true">\
		<b:includable id="main">\
			<b:include name="widget-title"/>\
			<b:include name="content"/>\
		</b:includable>\
		<b:includable id="content">\
			<div class="contact-form-widget"><div class="form">\
				<form name="shopping-form">\
				<fieldset id="form-shopping-product">\
					<span></span>\
				</fieldset>\
				<fieldset id="form-shopping-price">\
					<label>Đơn giá</label>\
					<span></span>\
				</fieldset>\
				<fieldset id="form-shopping-quantity">\
					<label>Số lượng</label>\
					<span>\
						<button>-</button>\
						<input inputmode="numeric" value="1"/>\
						<button>+</button>\
					</span>\
				</fieldset>\
				<fieldset id="form-shopping-actualCost">\
					<label>Tổng cộng</label>\
					<span/>\
				</fieldset>\
				<fieldset id="form-shopping-discount">\
					<label>Giảm giá</label>\
					<span/>\
				</fieldset>\
				<fieldset id="form-shopping-shipCost">\
					<label>Phí v.chuyển</label>\
					<span/>\
				</fieldset>\
				<fieldset id="form-shopping-lastCost">\
					<label>Thanh toán</label>\
					<span/>\
				</fieldset>\
				</form>\
				<form name="contact-form">\
				<fieldset id="bb-form-contact-name">\
					<input name="name" placeholder="Tên khách hàng" type="text"/>\
				</fieldset>\
				<fieldset id="bb-form-contact-phone">\
					<input inputmode="numeric" name="phone" placeholder="Số điện thoại, ví dụ: 0906600900"/>\
				</fieldset>\
				<fieldset id="bb-form-contact-address">\
					<input name="address" placeholder="Địa chỉ nhận hàng, ví dụ: 20 Ngõ 898, Đường Láng, Đống Đa, Hà Nội" type="text"/>\
				</fieldset>\
				<fieldset id="bb-form-contact-message">\
					<textarea name="message" placeholder="Ghi chú thêm"/>\
				</fieldset>\
				<fieldset id="form-contact-name">\
					<input class="contact-form-name" expr:id="data:widget.instanceId + \'_contact-form-name\'" name="name" placeholder="Tên khách hàng" type="text"/>\
				</fieldset>\
				<fieldset id="form-contact-email">\
					<input class="contact-form-email" expr:id="data:widget.instanceId + \'_contact-form-email\'" name="email" placeholder="Địa chỉ hòm thư" type="text"/>\
				</fieldset>\
				<fieldset id="form-contact-message">\
					<textarea class="contact-form-email-message" expr:id="data:widget.instanceId + \'_contact-form-email-message\'" name="email-message"/>\
				</fieldset>\
				<input class="contact-form-button contact-form-button-submit" expr:id="data:widget.instanceId + \'_contact-form-submit\'" expr:value="data:contactFormSendMsg" type="button" value="Mua"/>\
				<input class="bb-form-control" data-control="close" type="button" value="Hủy"/>\
				<div clss="form-notification">\
					<p class="contact-form-error-message" expr:id="data:widget.instanceId + \'_contact-form-error-message\'"/>\
					<p class="contact-form-success-message" expr:id="data:widget.instanceId + \'_contact-form-success-message\'"/>\
				</div>\
				</form>\
			</div></div>\
		</b:includable>\
		</b:widget>\
	</b:section>\
	';
	document.getElementById('bb-custom-01').innerHTML = bb_contactFormDom;
})();

const bb_information = {
	product: {name: 'Bổ não QA Gingko Biloba', price: 250000, options: true},
	options: {
		regular: {quantity: 1, percent: 20.4},
		popular: {quantity: 3, percent: 30},
		special: {quantity: 6, percent: 64}
	},
	discount: {active: true, minimumOrder: 500000, percent: 15},
	shipping: {active: true, baseShipCost: 20000, minimumOrder: 300000, percent: 15}
}


const bb_productName = document.querySelector('#form-shopping-product > span');
const bb_productPrice = document.querySelector('#form-shopping-price > span');
const bb_priceQuantity = document.querySelector('#form-shopping-quantity > span > input');
const bb_priceActualCost = document.querySelector('#form-shopping-actualCost > span');
const bb_priceDiscount = document.querySelector('#form-shopping-discount > span');
const bb_priceShipCost = document.querySelector('#form-shopping-shipCost > span');
const bb_pricelastCost = document.querySelector('#form-shopping-lastCost > span');
let bb_quantityCounter = bb_priceQuantity.value;

bb_productName.textContent = bb_information.product.name;
let bb_tempNode = document.createElement('small');
bb_tempNode.innerHTML = `Đơn trên ${BB_numberWithCommas(bb_information.shipping.minimumOrder-1000, 0)} miễn phí vận chuyển, giảm thêm ${bb_information.shipping.percent}% cho đơn trên ${BB_numberWithCommas(bb_information.discount.minimumOrder-1000, 0)}`;
bb_productName.after(bb_tempNode);
bb_productPrice.innerHTML = BB_numberWithCommas(bb_information.product.price, 0);
BB_sumTotal();

document.querySelector('#form-shopping-quantity > span > button:nth-last-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	bb_quantityCounter++;
	bb_priceQuantity.value = bb_quantityCounter;
	BB_sumTotal();
});

document.querySelector('#form-shopping-quantity > span > button:nth-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	if (bb_priceQuantity.value > 0) bb_quantityCounter--;
	bb_priceQuantity.value = bb_quantityCounter;
	BB_sumTotal();
});

bb_priceQuantity.addEventListener('input', (event) => {
	event.preventDefault();
	bb_quantityCounter = bb_priceQuantity.value;
	BB_sumTotal();
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
				`${bb_productName.textContent}\nSố lượng: ${bb_priceQuantity.value} hộp\n` +
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
document.querySelectorAll('[data-control="start"]').forEach(function(elem){
	elem.href = 'javascript:void(0)';
	elem.onclick = function (){bb_modal.style.cssText = 'display: flex; position: fixed'}
});
document.querySelector('[data-control="close"]').onclick = function(){bb_modal.style.display = 'none'}
window.onclick = function(event) {if(event.target == bb_modal) bb_modal.style.display = 'none'}



function BB_sumTotal(){
	let _calculated = parseInt(bb_priceQuantity.value, 10) * bb_information.product.price;
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
	bb_priceActualCost.innerHTML = BB_numberWithCommas(_calculated, 1000);
	bb_priceDiscount.innerHTML = BB_numberWithCommas(_discount, 1000);
	bb_priceShipCost.innerHTML = BB_numberWithCommas(_shipCost, 1000);
	bb_pricelastCost.innerHTML = BB_numberWithCommas(_lastCost + _shipCost, 1000);
}


function BB_numberWithCommas(_number, _round){
	if(Number.isInteger(_round) && _round > 0) _number = Math.round(_number/_round)*_round;
	return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '<sup>đ</sup>';
}


