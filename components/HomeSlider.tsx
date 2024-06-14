'use client'
import { ReactNode, useEffect, useState } from "react";
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { IHomeSlide } from "../app-store/products/types";
import Image from "next/image";

export function HomeSlider({maxSlides}: {maxSlides?: number}) {

  const INTERVAL_LENGTH = 4000;
  const AUTOPLAY = false;

  const [autoplay, setAutoplay] = useState(AUTOPLAY);
  const [currentItem, setCurrentItem] = useState(0);
  const [items, setItems] = useState<ReactNode[]>([]);
  const prev = () => {
    if (currentItem === 0) {
      setCurrentItem(items.length - 1);
    } else {
      setCurrentItem(currentItem - 1);
    }
  }
  const next = () => {
    if (currentItem === items.length - 1) {
      setCurrentItem(0);
    } else {
      setCurrentItem(currentItem + 1);
    }
  }

  useEffect(() => {
      document.body.classList.add('animated-page');
      document.body.classList.add('page-loaded');
    const photos: IHomeSlide[] = [
      {
        id: 1,
        title: 'Go Adventure with GoPro',
        subtitle: 'Its monsoons! More travel and more adventure. Rent a GoPro Hero 11 Black and capture your memories.',
        img: '/assets/v2/img/gopro-hero-11-black.png',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 750,
        model: 'model SX-200',
      },
      {
        id: 2,
        title: 'Go 360 with Insta360 X3',
        subtitle: 'What more do you need when you can capture your moments in 360!',
        img: '/assets/v2/img/insta-360-x3.png',
        imgBg: '/assets/v2/img/bg-slider-2.svg',
        price: 900,
        model: 'model M-300',
      },
      {
        id: 3,
        title: 'Camp anywhere anytime',
        subtitle: 'Rent a camping tent for your next adventure.',
        img: '/assets/v2/img/4-person-camping-tent-waterproof.png',
        imgBg: '/assets/v2/img/bg-slider-3.svg',
        price: 350,
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
                zIndex: (currentItem === index ? 999 : 998),
                opacity: 1
              }}>
              <div className="main-slide-bg" style={{ backgroundImage: 'url(' + p.imgBg +')' }}></div>
              <div className="container">
                <div className="main-slide-info">
                  <h2 className="title">{p.title}</h2>
                  <p>{ p.subtitle}</p>
                  <a href="single-shop.html" className="btn">
                    <span>Book Now</span>
                  </a>
                </div>
                <div className="slide-img-cover">
                  <a href="single-shop.html" className="lable-bike">
                    <div className="lable-bike-img"><img src="assets/v2/img/bike-info-slide.jpg" alt="img" /></div>
                    <div className="lable-bike-item">
                      <div className="model">Starting</div>
                      <div className="price">₹1399</div>
                    </div>
                  </a>
                  <Image src={p.img} alt="img" className={"slide-img"} width={478} height={-1} />
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
      </ul>
    </div>

    <ul className="main-soc-list">
      <li><a href="https://www.facebook.com/rentacross">facebook</a></li>
      <li><a href="https://x.com/rent_across">twitter</a></li>
      <li><a href="https://www.instagram.com/rent_across">instagram</a></li>
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
