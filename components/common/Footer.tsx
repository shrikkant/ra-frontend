import React from "react";
import Scripts from "./Scripts";
import PageContainer from "./PageContainer";

export default function Footer() {
  return (<footer>
    <PageContainer>
      <div className="row footer-item-cover xs:px-4">
        <div className="footer-subscribe col-md-7 col-lg-8">
          <h6>stay in touch</h6>
          <ul className="footer-soc social-list">
            <li><a target="_blank" rel="noreferrer" href="https://www.facebook.com/rentacross"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
            <li><a target="_blank" rel="noreferrer" href="https://x.com/rentacross"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
            <li><a target="_blank" rel="noreferrer" href="https://www.instagram.com/rent_across"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
            <li><a target="_blank" rel="noreferrer" href="https://www.youtube.com/@statwide"><i className="fa fa-youtube-play" aria-hidden="true"></i></a></li>
          </ul>
          <div className="footer-autor">Questions? Please write us at: <a href="mailto:support@rentacross.com">support@rentacross.com</a></div>
        </div>
        <div className="footer-item col-md-5 col-lg-4">
          <h6>info</h6>
          <ul className="footer-list">
            <li><a href="/blog">Blog</a></li>
            <li><a href="/help">FAQ</a></li>
            <li><a href="/terms-of-use">Terms of Use</a></li>
            <li><a href="/rental-agreement">Rental Agreement</a></li>
            <li><a href="/rental-agreement">Legal Terms</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/return-refund-policy">Returns & Refunds</a></li>
          </ul>
        </div>
      </div>
      <div className="row footer-item-cover xs:px-4">
        <div className="footer-touch col-md-7 col-lg-8">

        </div>
        <div className="footer-item col-md-5 col-lg-4">
          <h6>Locations</h6>
          <ul className="footer-list">
            <li><a href="/pune">Pune</a></li>
            <li><a href="/mumbai">Mumbai</a></li>
            <li><a href="/bengaluru">Bengaluru</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright xs:px-4">
          <a target="_blank" rel="noreferrer" href="https://www.rentacross.com">RentAcross</a>
          <span>© 2024. All Rights Reserved.</span>
        </div>
      </div>
    </PageContainer>
    <Scripts />
  </footer>)
}
