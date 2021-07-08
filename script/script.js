const headerSityButton = document.querySelector('.header__city-button');

let hash = location.hash.substring(1);


headerSityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';


headerSityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город');
    headerSityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
});

// блокировка скролла 

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,

    });
};

// модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModelOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModelClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};

subheaderCart.addEventListener('click', cartModelOpen);

subheaderCart.addEventListener('keydown', event => {
    const key = event.key;

    if (key === 'Escape') {
        cartModelClose();
    }
});

cartOverlay.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('cart__btn-close') || target.matches('.cart-overlay')) {
        cartModelClose();
    }
});


// запрос базы данных

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`);
    }
};

const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value));
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err);
        });
};

try {

    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page!';
    }

    const createCard = ({ id, preview, cost, brand, name, sizes }) => {
        
        const li = document.createElement('li');

        li.classList.add('goods__item');

        li.innerHTML = `
        <article class="good">
            <a class="good__link-img" href="card-good.html#${id}">
                <img class="good__img" src="goods-image/${preview}" alt="">
            </a>
            <div class="good__description">
                <p class="good__price">${cost} &#8381;</p>
                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                ${sizes ?
                    `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>`: 
                    ``}
            </div>
        </article>
        `;
        return li;
    };

    const renderGoodsList = data => {
        goodsList.textContent = '';

        
        data.forEach((item) => {
            const card = createCard(item);
            goodsList.append(card);
            console.log(data);
        });
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash);
        const goodsTitle = document.querySelector('.goods__title');

        if (hash === 'women') {
            goodsTitle.textContent = 'Женщинам';
        } else if (hash === 'men') {
            goodsTitle.textContent = 'Мужчинам';
        } else {
            goodsTitle.textContent = 'Детям';
        }
    });

    getGoods(renderGoodsList, hash);

} catch (e) {
    console.warn(err);

}
