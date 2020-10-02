(function () {
    const burgerItem = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const menuClose = document.querySelector('.cross-link');

    burgerItem.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.add('menu--active');
    });

    menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.remove('menu--active');
    });

    menu.addEventListener('click', () => {
        menu.classList.remove('menu--active');
    })

}());