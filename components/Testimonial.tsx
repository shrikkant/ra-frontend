
'use client'
import React, { Fragment } from "react";
import { ReactNode, useEffect, useState } from "react";

import { ITestimonial } from "../app-store/app-defaults/types";
import PageContainer from "./common/PageContainer";
import { Transition } from "@headlessui/react";

export function Testimonial({ maxSlides }: { maxSlides?: number }) {



  const [items, setItems] = useState<ReactNode[]>([]);
  const [currentItem, setCurrentItem] = useState(0);

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

  const isActive = (index: number) => {
    return currentItem === index;
  }


  useEffect(() => {

    const testimonials: ITestimonial[] = [
      {
        id: 1,
        name: 'Prathamesh Dalvi',
        rating: 5,
        description: '“I recently rented the Nikkor 70-300mm lens for a photo shoot and was extremely satisfied with my experience. The procedure was easy and lens was in excellent condition. The images I captured with this lens were stunning - the sharpness, color accuracy, and overall image quality were all exceptional.”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjUIHossDX68OWhierQScgMeRCBhRA9RwusuGCK3C8iqxZSVqxpU',
      },
      {
        id: 2,
        name: 'Sam Barton',
        rating: 4,
        description: 'It was a great experience hassle free camera rental experience. As a beginner i Took Canon EOS 200 It came with dual lens and i loved taking pictures with it. Camera was in good condition and at a affordable price.',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocK1hTOa8OlfN77Klr7SstJT3ar_IFZMusfvgOT4CkN4jEWG8Q'
      },
      {
        id: 3,
        name: 'Prasad Kaiche',
        rating: 4,
        description: '“It was a very nice experience for getting the GoPro 11 from RentAcross. I was provided with the the proper mods and selfie stick for having perfect usage. Received multiple memory cards. Very much reliable and recommendable. Thanks for all the support.”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjWvQL2KRApAD6k8PgtB2sSMbhmCKCgQXG0VWaZdvmPmKfOBjGuL',
      },
      {
        id: 4,
        name: 'Aniket D',
        rating: 4,
        description: '“It was a great experience again! I did take DSLR on rent previously too. Process is quite simple and equipment was clean and in mint condition. I would highly recommend Rentacross if you need a DSLR.”',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocKTd0fQ1ZHDizpTXVhF8b67Apyti05HzkksPSBctJbUUkX_Dw',
      },
      {
        id: 5,
        name: 'Digvijay Gore',
        rating: 4,
        description: '“Hastle Free Services for Rental Camera and Gears in Pune City Best arrangement and convenient from Owner Recommend strongly for Rental Camera Services Budget Friendly Costs for all cameras”',
        img: 'https://lh3.googleusercontent.com/a/ACg8ocLgzppJl3B9IZ8DKdsZgpRDUNwT6OGd6B4b7QUVigtA1CAASA',
      },
      {
        id: 6,
        name: 'Shridhar Kinkar',
        rating: 4,
        description: '“Rent Across is a very great initiative and its like a boon to photographers in areas like Baner, Pashan, Wakad, Hinjawadi & Punawale...I have availed their services twice for event photography and both the times it was a pleasant experience.Mr.Shrikant is a very nice and soft spoken person.Keep up the good work Team Rent Across 👍🏻👍🏻👍🏻”',
        img: 'https://lh3.googleusercontent.com/a-/ALV-UjVc4w_Xfb94JWiOj2VXL73jk-uKwk9qHYMb1aK6l0H3WOiDxkOm',
      }
    ];

    const items = testimonials.map((t, index) => {
      return (

        <div key={index} className={"feedback-slide " + (currentItem === index ? "slick-current slick-active" : "")}
          style={{
            top: 0,
            zIndex: 999,

          }}>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-1000"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-750"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={isActive(index)}

          >
            <div className="feedback-item transition duration-300 ease-in data-[closed]:opacity-0">
              <div className="feedback-content">
                <p>{t.description}</p>
              </div>
              <div className="feedback-item-top">
                <img src={t.img} alt="photo" />
                <div className="feedback-title">
                  <h5 className="title"><span>{t.name}</span></h5>
                  <ul className="rating">
                    <li className="star-bg"><i className="fa fa-star" ></i></li>
                    <li className="star-bg"><i className="fa fa-star" ></i></li>
                    <li className="star-bg"><i className="fa fa-star" ></i></li>
                    <li className="star-bg"><i className="fa fa-star" ></i></li>
                    <li className="star-bg"><i className="fa fa-star" ></i></li>
                  </ul>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )
    });

    setItems(items);

  }, [currentItem]);


  return (<section className="s-feedback" style={{ backgroundImage: 'url(assets/v2/img/bg-feedback.jpg)' }}>
    <span className="effwct-bg-feedback" style={{ backgroundImage: 'url(assets/v2/img/effect-bg-feedback.svg)' }}></span>
    <span className="mask"></span>
    <div className="sm:container mx-auto relative z-10">


      <h2 className="title">feedback</h2>
      <div className="feedback-slider relative">
        <span onClick={prev} className="slick-arrow-prev slick-arrow">
          <i className="fa fa-angle-left" ></i>
        </span>

        <div aria-live="polite" className="slick-list draggable" style={{ position: 'relative', overflow: "hidden", boxSizing: 'border-box' }}>
          <div className="slick-track" role="listbox"
            style={{ transformStyle: "preserve-3d" }}>
            {items && items.map((item, index) => item)}
          </div>
        </div>



        <span className="slick-arrow-next slick-arrow z-[10000]" onClick={next}>
          <i className="fa fa-angle-right" ></i>
        </span>
      </div>
    </div>

  </section>)


}
