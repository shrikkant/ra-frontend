import React from "react";

export default function HomeAdvantages() {
  return (<section className="s-our-advantages" style={{ backgroundImage: 'url(/assets/v2/img/bg-advantages.jpg)' }} >
    <span className="mask"></span>
    <div className="sm:container mx-auto relative z-[1]">
      <h2 className="title">Our Advantages</h2>
      <div className="our-advantages-wrap">
        <div className="our-advantages-item">
          <img className="lazy" src="assets/v2/img/placeholder-all.png"
            data-src="assets/v2/img/advantages-1.svg" alt="icon" />
          <h5>Doorstep Pickup & Delivery</h5>
        </div>
        <div className="our-advantages-item">
          <img className="lazy" src="assets/v2/img/placeholder-all.png"
            data-src="assets/v2/img/advantages-2.svg" alt="icon" />
          <h5>Affordable Rentals</h5>
        </div>
        <div className="our-advantages-item">
          <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-3.svg" alt="icon" />
          <h5>Exchange and return within 14 days</h5>
        </div>
        <div className="our-advantages-item">
          <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-4.svg" alt="icon" />
          <h5>Hassle free booking exprience</h5>
        </div>
      </div>
    </div>
  </section>)
}
