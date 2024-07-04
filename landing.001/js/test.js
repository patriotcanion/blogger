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
const bb_priceQuantity = document.querySelector('#form-shopping-quantity > span');
const bb_priceQuantityInput = bb_priceQuantity.querySelector('input');
const bb_priceActualCost = document.querySelector('#form-shopping-actualCost > span');
const bb_priceDiscount = document.querySelector('#form-shopping-discount > span');
const bb_priceShipCost = document.querySelector('#form-shopping-shipCost > span');
const bb_pricelastCost = document.querySelector('#form-shopping-lastCost > span');
let bb_quantityCounter = bb_priceQuantityInput.value;

bb_productName.textContent = bb_information.product.name;
let bb_tempNode = document.createElement('small');
bb_tempNode.innerHTML = `Đơn trên ${BB_numberWithCommas(bb_information.shipping.minimumOrder-1000, 0)} miễn phí vận chuyển, giảm thêm ${bb_information.shipping.percent}% cho đơn trên ${BB_numberWithCommas(bb_information.discount.minimumOrder-1000, 0)}`;
bb_productName.after(bb_tempNode);
bb_productPrice.innerHTML = BB_numberWithCommas(bb_information.product.price, 0);
BB_sumTotal();

bb_priceQuantity.querySelector('button:nth-last-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	bb_quantityCounter++;
	bb_priceQuantityInput.value = bb_quantityCounter;
	BB_sumTotal();
});

bb_priceQuantity.querySelector('button:nth-child(1)').addEventListener('click', (event) => {
	event.preventDefault();
	if (bb_priceQuantityInput.value > 0) bb_quantityCounter--;
	bb_priceQuantityInput.value = bb_quantityCounter;
	BB_sumTotal();
});

bb_priceQuantityInput.addEventListener('input', (event) => {
	event.preventDefault();
	bb_quantityCounter = bb_priceQuantityInput.value;
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
				`${bb_productName.textContent}\nSố lượng: ${bb_priceQuantityInput.value} hộp\n` +
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
	let _calculated = parseInt(bb_priceQuantityInput.value, 10) * bb_information.product.price;
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


