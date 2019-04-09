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

instagramFeed();



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

    // Scroll to content
    const scrollDownBtn = document.getElementById('scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', goDown);
    }

    // Picture zoom
    const pictureZoomer = document.getElementById('picture-zoomer');
    if (pictureZoomer) {
        const pictureZoomerList = pictureZoomer.querySelector('.pz__list').querySelectorAll('a');
        if (pictureZoomerList) {
            // Listen click
            pictureZoomerList.forEach((photoLink) => {
                photoLink.addEventListener('click', pictureZoomerClick);
            });
    
            // Load first
            loadZoom(pictureZoomerList[0].attributes.href.value);
        }
    }
});

function changeLanguage (event) {
    console.log('change lang', event.target.value);
    document.location.href = event.target.value;
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

function goDown (event) {
    event.preventDefault();
    document.documentElement.scrollTop = document.querySelector('#about').offsetTop;
}

function pictureZoomerClick (event) {
    event.preventDefault();
    loadZoom(this.attributes.href.value);
}

function loadZoom(src) {
    const pzZoom = document.querySelector('.pz__zoom');
    const pzLightbox = document.querySelector('.pz__lightbox');

    let img = pzZoom.querySelector('img');
    let lightboxImg = pzLightbox.querySelector('img');

    let newImg = new Image;
    newImg.onload = function() {
        console.log('loaded');
        img.src = this.src;
        lightboxImg.src = this.src;
    }
    newImg.src = src;


    let lighboxLink = pzZoom.querySelector('a');
    lighboxLink.href = src;
    lighboxLink.addEventListener('click', openLightbox);
}

function openLightbox(e) {
    e.preventDefault();
    document.body.classList.add('body--lightbox-visible');
    document.querySelector('.pz__lightbox').addEventListener('click', closeLightbox);
    document.addEventListener('touchmove', preventMobileLightboxScroll, { passive: false });
    document.addEventListener('keyup', keyupLightbox);
}

function closeLightbox () {
    document.body.classList.remove('body--lightbox-visible');
    document.querySelector('.pz__lightbox').removeEventListener('click', closeLightbox);
    document.removeEventListener('touchmove', preventMobileLightboxScroll, { passive: false });
    document.removeEventListener('keyup', keyupLightbox);
}

function preventMobileLightboxScroll (e) {
    if (e.target.tagName && e.target.tagName === 'IMG') {
       return; 
    }
    e.preventDefault();
}

let imgPosition = 0;
let imgCurrentPosition = 0;
function keyupLightbox (e) {
    console.log('key', e);

    // current lightbox
    const pzLightbox = document.querySelector('.pz__lightbox');
    const imgPzLightbox = pzLightbox.querySelector('img');

    // All pictures
    const pictureZoomerList = document.querySelector('.pz__list').querySelectorAll('a');
    pictureZoomerList.forEach((photoLink) => {
        if (photoLink.attributes.href === imgPzLightbox.src) {
            imgCurrentPosition = imgPosition;
        }
        imgPosition++;
    });

    // Remove previous animation
    pzLightbox.classList.remove('pz__lightbox--animation-from-left', 'pz__lightbox--animation-from-right');

    setTimeout(() => {
        // Left key
        if (e.keyCode === 37 && imgCurrentPosition > 0) {
            imgCurrentPosition -= 1;
            pzLightbox.classList.add('pz__lightbox--animation-from-left');
            loadZoom(pictureZoomerList[imgCurrentPosition]);
        }
        // Right key
        else if (e.keyCode === 39 && imgCurrentPosition < pictureZoomerList.length - 1) {
            imgCurrentPosition += 1;
            pzLightbox.classList.add('pz__lightbox--animation-from-right');
            loadZoom(pictureZoomerList[imgCurrentPosition]);
        }
    }, 0);
}

function instagramFeed () {
    const container = document.getElementById('instafeed');
    if (container) {
        const token = '181433493.bbfd1e2.029419edb93d4945b471ecffee384cf3',
            num_photos = 6, // maximum 20
            scrElement = document.createElement('script');
         
        window.writeFeed = function( data ) {
            const pictures = data.data;
            pictures.forEach((picture) => {
                container.innerHTML += `
                <div class="picture">
                    <img src="${picture.images.low_resolution.url}" alt="">
                </div>
                `;
            });
        }
         
        scrElement.setAttribute('src', `https://api.instagram.com/v1/users/self/media/recent?access_token=${token}&count=${num_photos}&callback=writeFeed`);
        document.body.appendChild(scrElement);
    }
}