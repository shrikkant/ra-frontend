'use client'
import React from 'react';
import { ReactNode, useEffect, useState } from "react";
import { IHomeSlide } from "../app-store/products/types";
import Image from "next/image";
import PageContainer from "./common/PageContainer";

export function HomeSlider() {



  const INTERVAL_LENGTH = 6000;
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
    const photos: IHomeSlide[] = [
      {
        id: 1,
        title: 'Rent Canon R10 Mirrorless Camera',
        subtitle: 'Capture Every Moment with the Versatile Canon R10',
        img: '/uploads/photos/944/canon-r10-mirrorless-camera.jpg',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 800,
        model: 'Canon R10',
        url: '/rent/pune/rent-camera/canon-eos-r10-mirrorless-digital-camera-3494'
      },
      {
        id: 2,
        title: 'Go 360 with Insta360 X3',
        subtitle: 'What more do you need when you can capture your moments in 360!',
        img: '/assets/v2/img/insta-360-x3.png',
        imgBg: '/assets/v2/img/bg-slider-2.svg',
        price: 900,
        model: 'model M-300',
        url: '/pune/rent-gopro-cameras/Insta360-ONE-X2-3452'
      },
      {
        id: 3,
        title: 'Camp anywhere anytime',
        subtitle: 'Rent a camping tent for your next adventure.',
        img: '/assets/v2/img/4-person-camping-tent-waterproof.png',
        imgBg: '/assets/v2/img/bg-slider-3.svg',
        price: 500,
        model: 'model X-230',
        url: '/pune/rent-camping-tents/Coleman-Camping-Tent-with-Fibreglass-poles-4-Person-3482'
      },
      {
        id: 3,
        title: 'Capture the details with DSLR',
        subtitle: 'Complete your photography kit with a Sony A7 III DSLR camera.',
        img: '/assets/v2/img/sony-a7-III-dslr-camera-1.png',
        imgBg: '/assets/v2/img/bg-slider.svg',
        price: 1500,
        model: 'model X-230',
        url: '/pune/rent-camera/Sony-A7-M-III-3317'
      },
    ];


    const items =
      photos?.map((p, index) => {
        return (
          <div key={index} className={"main-slide " + (currentItem === index ? "slick-current slick-active" : "")}
            style={{
              width: '100vw',
              top: 0,
              zIndex: (currentItem === index ? 999 : 998),
              opacity: 1
            }}>
            <div className="main-slide-bg" style={{ backgroundImage: 'url(' + p.imgBg + ')' }}></div>
            <PageContainer>
              <div className="main-slide-info">
                <h1 className="title">{p.title}</h1>
                <p>{p.subtitle}</p>
                <a href={p.url} className="btn">
                  <span>Book Now</span>
                </a>
              </div>
              <div className="slide-img-cover">
                <a href={p.url} className="lable-bike">
                  <div className="lable-bike-img p-2">
                    <Image src={p.img} alt="img" width={89} height={-1} />
                  </div>
                  <div className="lable-bike-item">
                    <div className="model">Starting</div>
                    <div className="price">₹{p.price}</div>
                  </div>
                </a>

                <div className="block sm:hidden">
                  <Image src={p.img} alt="img" className={"slide-img"} width={200} height={-1} />
                </div>

                <div className="lg:hidden md:block hidden">
                  <Image src={p.img} alt="img" className={"slide-img"} width={320} height={-1} />
                </div>

                <div className="xl:hidden lg:block hidden">
                  <Image src={p.img} alt="img" className={"slide-img"} width={360} height={-1} />
                </div>

                <div className="xl:block hidden">
                  <Image src={p.img} alt="img" className={"slide-img"} width={360} height={-1} />
                </div>


              </div>
            </PageContainer>
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
            <li key={index} onClick={() => changeSlide(index)} aria-hidden="true" role="presentation" aria-selected="false" aria-controls="navigation30" id={"slick-slide3" + index} className={index == currentItem ? "slick-active" : ""}>
              <button type="button" data-role="none" role="button">{index + 1}</button>
            </li>
          )
        })}
      </ul>
    </div>

    <ul className="main-soc-list">
      <li>
        <a rel="noreferrer" target="_blank" href="https://www.facebook.com/rentacross">facebook</a></li>
      <li>
        <a rel="noreferrer" target="_blank" href="https://x.com/rentacross">twitter</a></li>
      <li>
        <a rel="noreferrer" href="https://www.instagram.com/rent_across" target="_blank">
          instagram</a></li>
    </ul>

    <section className="main-slider relative w-full overflow-hidden">
      <div className="slick-list draggable" style={{ position: 'relative', overflow: "hidden", boxSizing: 'border-box' }} >
        <div className="slick-track" style={{ transformStyle: "preserve-3d" }}>
          {items && items.map((item, index) => item)}
        </div>
      </div>

    </section>
  </section>
  );
}
