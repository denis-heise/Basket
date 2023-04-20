const basket = () => {
	const inputNameCard = document.querySelector('#name_of_card');
	const inputsNumberCard = document.querySelectorAll('.billing-block__inputs-number-card input');
	const inputExpireDate = document.querySelector('#expire_date');
	const inputCvvCode = document.querySelector('#cvv_code');
	const closeButton = document.querySelectorAll('.basket-block__close-button');
	const oneProducts = document.querySelectorAll('.basket-block__one-product');
	const circleIconSelectProducts = document.querySelector('.header__circle-select-products');
	const oneProductIconHeader = document.querySelector('.header__one-product');
	const twoProductIconHeader = document.querySelector('.header__two-products');
	const subtotalPrice = document.querySelector('.basket-block__price-subtotal');
	const burgerMenu = document.querySelector('.header__burger-menu-body');
	let transfer = 0;

	inputNameCard.addEventListener('keyup', function () {
		this.value = this.value.replace(/[0-9]/, '');
		this.value = this.value.toUpperCase();
	});

	inputsNumberCard.forEach(item => {
		// eslint-disable-next-line consistent-return
		item.addEventListener('keyup', function (evt) {
			const maxLength = this.getAttribute('maxlength');
			const nextInput = this.nextElementSibling;
			const prevInput = this.previousElementSibling;
			const lengthValueInput = this.value.length;
			this.value = this.value.replace(/\D/g, '');

			if (/[0-9\b]/.test(String.fromCharCode(evt.keyCode))) {
				if (lengthValueInput >= maxLength && nextInput !== null) {
					this.nextElementSibling.focus();
					transfer = 1;
				} else if (evt.keyCode === 8 && lengthValueInput === 0 && prevInput !== null) {
					if (transfer !== 0) {
						prevInput.focus();
						prevInput.value = prevInput.value.slice(0, -1);
						return (transfer = 0);
					}
					transfer = 1;
				} else if (evt.keyCode !== 8) {
					transfer = 0;
				}
			}
		});
	});

	inputCvvCode.addEventListener('keyup', function () {
		this.value = this.value.replace(/\D/g, '');
	});

	function inputCard(input) {
		const formatPos = function (char, backspace) {
			const separator = '/';
			let start = 0;
			let end = 0;
			let pos = 0;
			let value = input.value;

			if (char !== false) {
				start = input.selectionStart;
				end = input.selectionEnd;

				if (backspace && start > 0) {
					start--;
					if (value[start] === separator) {
						start--;
					}
				}
				value = value.substring(0, start) + char + value.substring(end);
				pos = start + char.length;
			}

			let d = 0;
			// eslint-disable-next-line no-unused-vars
			let dd = 0;
			let gi = 0;
			let newV = '';
			const groups = [2, 2];

			function sortNumbers(group) {
				for (let i = 0; i < value.length; i++) {
					if (/\D/.test(value[i])) {
						if (start > i) {
							pos--;
						}
					} else {
						if (d === group[gi]) {
							newV += separator;
							d = 0;
							gi++;

							if (start >= i) {
								pos++;
							}
						}
						newV += value[i];
						d++;
						dd++;
					}
					if (d === group[gi] && group.length === gi + 1) {
						break;
					}
				}
			}

			sortNumbers(groups);

			input.value = newV;

			if (char !== false) {
				input.setSelectionRange(pos, pos);
			}
		};

		input.addEventListener('keypress', function (e) {
			const code = e.charCode || e.keyCode || e.which;
			if (code !== 9 && (code < 37 || code > 40) && !(e.ctrlKey && (code === 99 || code === 118))) {
				e.preventDefault();
				const char = String.fromCharCode(code);
				formatPos(char);
			}
		});

		input.addEventListener('keydown', function (e) {
			if (e.keyCode === 8 || e.keyCode === 46) {
				e.preventDefault();
				formatPos('', this.selectionStart === this.selectionEnd);
			}
		});

		input.addEventListener('paste', function () {
			setTimeout(function () {
				formatPos('');
			}, 50);
		});

		input.addEventListener('blur', function () {
			formatPos(this, false);
		});
	}

	closeButton.forEach(item => {
		item.addEventListener('click', function () {
			const blockProduct = this.closest('.basket-block__one-product');
			blockProduct.remove();
			// eslint-disable-next-line no-use-before-define
			getNewTotalPrice();
		});
	});

	oneProducts.forEach(item => {
		const numberSelect = item.querySelector('.basket-block__number-select');
		const priceOneProduct = item.querySelector('.basket-block__price-one-product span');
		const quantityProduct = numberSelect.querySelector('span');
		const PRICE_PRODUCT = priceOneProduct.textContent;

		numberSelect.addEventListener('click', function (evt) {
			const target = evt.target;

			if (target.classList.contains('basket-block__number-plus')) {
				quantityProduct.textContent = Number(quantityProduct.textContent) + 1;
				priceOneProduct.textContent = Number(priceOneProduct.textContent) + Number(PRICE_PRODUCT);
				// eslint-disable-next-line no-use-before-define
				getNewTotalPrice();
			} else if (
				target.classList.contains('basket-block__number-minus') &&
				Number(quantityProduct.textContent) > 1
			) {
				quantityProduct.textContent = Number(quantityProduct.textContent) - 1;
				priceOneProduct.textContent = Number(priceOneProduct.textContent) - Number(PRICE_PRODUCT);
				// eslint-disable-next-line no-use-before-define
				getNewTotalPrice();
			}
		});
	});

	function getNewTotalPrice() {
		const priceProducts = document.querySelectorAll('.basket-block__price-one-product span');
		const quantityProduct = document.querySelectorAll('.basket-block__number-select span');
		const priceSipping = document.querySelector('.basket-block__price-sipping');
		const tax = document.querySelector('.basket-block__tax');
		const priceTotal = document.querySelector('.basket-block__price-total');

		if (priceProducts.length > 1) {
			subtotalPrice.textContent = `$ ${
				Number(priceProducts[0].textContent) + Number(priceProducts[1].textContent)
			}`;
			tax.textContent = `$ ${
				(Number(quantityProduct[0].textContent) + Number(quantityProduct[1].textContent)) * 50
			}`;
		} else if (priceProducts.length === 1) {
			subtotalPrice.textContent = `$ ${Number(priceProducts[0].textContent)}`;
			tax.textContent = `$ ${Number(quantityProduct[0].textContent) * 50}`;
			twoProductIconHeader.style.display = 'none';
			oneProductIconHeader.style.display = 'block';
		} else {
			circleIconSelectProducts.style.display = 'none';
			oneProductIconHeader.style.display = 'none';
			subtotalPrice.textContent = `$ 0`;
			tax.textContent = `$ 0`;
			priceSipping.textContent = `$ 0`;
		}

		priceTotal.textContent = `$ ${
			Number(subtotalPrice.textContent.replace('$', '')) +
			Number(tax.textContent.replace('$', '')) +
			Number(priceSipping.textContent.replace('$', ''))
		}`;
	}

	burgerMenu.addEventListener('click', function () {
		this.querySelector('.header__burger-menu-strip').classList.toggle('active');
		document.querySelector('.header__burger-menu-header').classList.toggle('active');
	});

	inputCard(inputExpireDate);
	getNewTotalPrice();
};

export default basket;
