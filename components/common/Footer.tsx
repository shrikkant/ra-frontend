import React from 'react'
import Scripts from './Scripts'

export default function Footer() {
  return (
    <footer>
      <div className="sm:container mx-auto p-4">
        <div className="row footer-item-cover xs:px-4">
          <div className="footer-subscribe col-md-7 col-lg-8">
            <ul className="footer-soc social-list">
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/rentacross"
                  aria-label="Visit our Facebook page"
                >
                  <i className="fa fa-facebook" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://x.com/rentacross"
                  aria-label="Follow us on X"
                >
                  <i className="fa fa-twitter" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.instagram.com/rent_across"
                  aria-label="Follow us on Instagram"
                >
                  <i className="fa fa-instagram" aria-hidden="true"></i>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.youtube.com/@rentacross"
                  aria-label="Subscribe our YouTube channel"
                >
                  <i className="fa fa-youtube-play" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-item col-md-5 col-lg-4">
            <ul className="footer-list">
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/about-us">About Us</a>
              </li>
              <li>
                <a href="/rental-agreement">Rental Agreement</a>
              </li>
              <li>
                <a href="/why-us">Why Us ?</a>
              </li>
              <li>
                <a href="/terms-of-use">Terms of Use </a>
              </li>
              <li>
                <a href="/our-story">Our Story</a>
              </li>

              {/* Old Privacy Policy,return-refund code
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/return-refund-policy">Returns & Refunds</a></li> */}
            </ul>
          </div>
        </div>
        <div className="row footer-item-cover xs:px-4 pb-8">
          <div className="footer-touch col-md-7 col-lg-8"></div>
          <div className="footer-item col-md-5 col-lg-4">
            <ul className="footer-list">
              <li>
                <a href="/pune">Pune</a>
              </li>
              <li>
                <a href="/mumbai">Mumbai</a>
              </li>
              <li>
                <a href="/bangalore">Bengaluru</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Scripts />
    </footer>
  )
}
