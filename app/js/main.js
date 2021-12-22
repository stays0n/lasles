const bodyStyle = document.body.style;
const zooms = document.querySelectorAll('.zoom');
const networkMap = document.querySelector('.network__map');
const header = document.querySelector('.header');
const headerTop = document.querySelector('.header__top');
const headerTopOffsetTop = headerTop.offsetTop;
const headerTopOffsetHeight = headerTop.offsetHeight;
const headerNav = document.querySelector('.header__nav');
const headerBurger = document.querySelector('.header__burger');
const headerLinks = document.querySelectorAll('.header__link');
const widthScroll = window.innerWidth - document.body.offsetWidth;
// console.log(headerNav.getBoundingClientRect());
// console.log(headerNavOffsetTop);
// console.log(headerNavOffsetHeight);
// console.dir(document.body.style);

function headerToggleActive() {
  if (headerNav.classList.contains('header__nav--active')) {
    headerNav.classList.remove('header__nav--active');
    bodyStyle.overflow = '';
  } else {
    headerNav.classList.add('header__nav--active');
    bodyStyle.overflow = 'hidden';
  }
}
// sticky header
function stickyHeader() {
  if (window.pageYOffset > (headerTopOffsetHeight * 2)) {
    headerTop.classList.add('header__top--sticky');
    header.style.cssText = `padding-top: ${headerTopOffsetHeight}px;`;
  } else {
    headerTop.classList.remove('header__top--sticky');
    header.style.cssText = '';
  }
}
// map markers
function offset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  }
}

// burger nav
headerBurger.addEventListener('click', headerToggleActive);

for (const headerLink of headerLinks) {
  headerLink.addEventListener('click', () => {
    if (headerNav.classList.contains('header__nav--active')) {
      headerToggleActive();
    }
  })
}

window.addEventListener('resize', (e) => {
  if (headerNav.classList.contains('header__nav--active') && e.target.innerWidth > 1200) {
    headerToggleActive();
  }

  if (headerTopOffsetHeight !== headerTop.offsetHeight) {
    headerTopOffsetHeight = headerTop.offsetHeight;
  }
}, false);

window.addEventListener('scroll', stickyHeader);

// map markers
if (zooms.length > 0) {
  window.addEventListener('scroll', mapInViewArea);

  function appendMarkersOnMap() {
    let delay = 0;
    for (let zoom of zooms) {
      networkMap.classList.add('active');
      if (delay < 1000) {
        zoom.style.animationDelay = Math.round(delay) + 'ms';
      } else {
        delay /= 1000;
        // zoom.style.animationDelay = (delay / 1000) + 's';
      }
      delay += 249;
    }
  }

  function mapInViewArea() {
    const networkMapHeight = networkMap.offsetHeight,
      networkMapOffset = offset(networkMap).top,
      animationStart = 2;

    let animationStartPoint = window.innerHeight - networkMapHeight / animationStart;
    if (networkMapHeight > window.innerHeight) {
      animationStartPoint = window.innerHeight - window.innerHeight / animationStart;
    }

    if ((pageYOffset > networkMapOffset - animationStartPoint) && (pageYOffset < networkMapOffset + networkMapHeight)) {
      appendMarkersOnMap();
    }
  }
}

$(function () {
  $('.network__sponsors').slick({
    arrows: false,
    slidesToShow: 5,
    responsive: [{
        breakpoint: 1201,
        settings: {
          slidesToShow: 3,
          centerMode: true,
        }
      },
      {
        breakpoint: 824,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 569,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  });

  $('.customers__list').slick({
    slidesToShow: 3,
    infinite: false,
    dots: true,
    rtl: false,
    variableWidth: true,
    appendDots: $('.customers__dots'),
    appendArrows: $('.customers__arrows'),
    prevArrow: '<button id="prev" type="button" class="slick-prev"><svg class="icon"><use xlink:href="images/icons/sprite.svg#arrow-left"></use></svg></button>',
    nextArrow: '<button id="next" type="button" class="slick-next"><svg class="icon"><use xlink:href="images/icons/sprite.svg#arrow-right"></use></svg></button>',
  });
});