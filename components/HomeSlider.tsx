
import { ReactNode, useEffect, useState } from "react";
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { IHomeSlide } from "../app-store/products/types";

export function HomeSlider({  }: {}) {

  const INTERVAL_LENGTH = 4000;
  const AUTOPLAY = false;

  const [autoplay, setAutoplay] = useState(AUTOPLAY);
  const [currentItem, setCurrentItem] = useState(0);
  const [items, setItems] = useState<ReactNode[]>([]);
  const prev = () => {
    setCurrentItem((curr: number) => (curr === 0 ? items.length - 1 : curr - 1));
  }
  const next = () =>
    setCurrentItem(currentItem+1);

  useEffect(() => {



    const photos: IHomeSlide[] = [
      {
        id: 1,
        title: 'Go Adventure with GoPro',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
        img: '/assets/v2/img/gopro-hero-11-black.png',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 1399,
        model: 'model SX-200',
      },
      {
        id: 2,
        title: 'Go 360 with Insta360 X3',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore consectetur sint iure id expedita saepe.',
        img: '/assets/v2/img/insta-360-x3.png',
        imgBg: '/assets/v2/img/bg-slider-2.svg',
        price: 1199,
        model: 'model M-300',
      },
      {
        id: 3,
        title: 'Camp anywhere anytime',
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis distinctio tenetur ab ut! Qui, facilis.',
        img: '/assets/v2/img/4-person-camping-tent-waterproof.png',
        imgBg: '/assets/v2/img/bg-slider-3.svg',
        price: 1099,
        model: 'model X-230',
      },
    ];


      const items =
        photos?.map((p, index) => {
          return (
            <div key={index} className={"main-slide " + (currentItem === index ? "slick-current slick-active" : "")}
              style={{
                width: '100vw',
                // left: (index > 0 ? -1000 * index : 0),
                top: 0,
                zIndex: 999,
                opacity: 1
              }}>
              <div className="main-slide-bg" style={{ backgroundImage: 'url(' + p.imgBg +')' }}></div>
              <div className="container">
                <div className="main-slide-info">
                  <h2 className="title">{p.title}</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
                  <a href="single-shop.html" className="btn"><span>Book Now</span></a>
                </div>
                <div className="slide-img-cover">
                  <a href="single-shop.html" className="lable-bike">
                    <div className="lable-bike-img"><img src="assets/v2/img/bike-info-slide.jpg" alt="img" /></div>
                    <div className="lable-bike-item">
                      <div className="model">model SX-200</div>
                      <div className="price">$1399</div>
                    </div>
                  </a>
                  <img src={p.img} alt="img" className="slide-img" />
                </div>
              </div>
            </div>
          )
        }
        ) as ReactNode[];


    setItems(items);

    if (!autoplay) return;
    const interval = setInterval(next, INTERVAL_LENGTH);

    return () => clearInterval(interval);
  }, [currentItem]);

  const changeSlide = (index: number) => {
    setCurrentItem(index);

  }

  return (<section className="s-main-slider">

    <div className="main-slide-navigation" role="toolbar">
      <span className="slick-arrow-prev slick-arrow" style={{ display: 'flex' }} onClick={prev}>
        <i className="fa fa-angle-up" aria-hidden="true"></i>
      </span>
      <span className="slick-arrow-next slick-arrow" style={{ display: 'flex' }} onClick={next}>
        <i className="fa fa-angle-down" aria-hidden="true"></i>
      </span>

      <ul className="slick-dots" role="tablist" style={{ display: 'block' }}>
        {items && items.map((_, index) => {
          return (
            <li key={index} onClick={() => changeSlide(index)} aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation30" id={"slick-slide3" + index} className={index == currentItem ? "slick-active": ""}>
              <button type="button" data-role="none" role="button">{index + 1}</button>
            </li>
          )
        })}
        {/* <li className="" aria-hidden="true" role="presentation" aria-selected="true" aria-controls="navigation30" id="slick-slide30">
          <button type="button" data-role="none" role="button">1</button>
        </li>
        <li aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation31" id="slick-slide31">
          <button type="button" data-role="none" role="button">2</button></li>
        <li aria-hidden="false" role="presentation" aria-selected="false" aria-controls="navigation32" id="slick-slide32" className="slick-active">
          <button type="button" data-role="none" role="button">3</button>
        </li>
        <li aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation33" id="slick-slide33">
          <button type="button" data-role="none" role="button" tabindex="0">4</button>
        </li>
        <li aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation34" id="slick-slide34">
          <button type="button" data-role="none" role="button" tabindex="0">5</button>
        </li> */}
      </ul>
    </div>

    <ul className="main-soc-list">
      <li><a href="https://www.facebook.com/rovadex">facebook</a></li>
      <li><a href="https://twitter.com/RovadexStudio">twitter</a></li>
      <li><a href="https://www.instagram.com/rovadex/">instagram</a></li>
    </ul>

    <section className="main-slider relative w-full overflow-hidden">
      <div className="slick-list draggable" style={{ position: 'relative', overflow: "hidden", boxSizing: 'border-box'}} >
        <div className="slick-track" style={{transformStyle: "preserve-3d"}}>
          {items && items.map((item, index) => item)}
        </div>
      </div>

    </section>
    </section>
  );
}

{/* <Transition
  key={index}
  show={currentItem === index}
  enter="transition-opacity duration-1000"
  enterFrom="opacity-0"
  enterTo="opacity-100"
  leave="transition-opacity duration-1000"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
  {item}
</Transition> */}
