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