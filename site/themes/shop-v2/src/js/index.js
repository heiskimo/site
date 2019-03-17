let buyButtonDefaultText = '';

Snipcart.subscribe('item.adding', function (ev, item, items) {
   console.log('***** ADDDINGGGG');
   const buyButton = document.querySelector('.snipcart-add-item');
   if (buyButton) {
        buyButtonDefaultText = buyButton.innerText;
        buyButton.innerText = 'Ajout....';
   }
});

Snipcart.subscribe('item.added', function (item) {
    console.log('***** ADDED', item);
    const buyButton = document.querySelector('.snipcart-add-item');
    if (buyButton) { 
        buyButton.innerText = buyButtonDefaultText;
    }
});



document.addEventListener('DOMContentLoaded', (/* event */) => {
	// Listen lang chane
	const langSelect = document.getElementById('lang');
	langSelect.addEventListener('change', changeLanguage);

    // Listen mobile menu openning
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    mobileMenuOpen.addEventListener('touchstart', openMenu);
    mobileMenuOpen.addEventListener('click', openMenu);

    // Listen mobile menu closing
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    mobileMenuClose.addEventListener('touchstart', closeMenu);
    mobileMenuClose.addEventListener('click', closeMenu);
});

function changeLanguage (event) {
	console.log('change lang', event.target.value);
}

function openMenu (e) {
    e.preventDefault();
    document.body.classList.add('body--mobile-menu-opened');
    document.addEventListener('touchmove', preventMobileScroll, { passive: false });
}

function closeMenu (e) {
    e.preventDefault();
    document.body.classList.remove('body--mobile-menu-opened');
    document.removeEventListener('touchmove', preventMobileScroll, { passive: false });
}

function preventMobileScroll (e) {
    e.preventDefault();
}
