import {

  Layout,
  Menu,
  Space,
} from 'antd'

import { Content } from 'antd/lib/layout/layout'
import ProductGrid from '../components/ProductGrid'
import React, { useEffect, useState } from 'react'

import { AppLayout } from '../components/AppLayout'
import Script from 'next/script'
import { set } from 'date-fns'
import { HomeSlider } from '../components/HomeSlider'
import { IHomeSlide } from '../app-store/products/types'
import { useRouter } from 'next/router'

export default function Home() {
  // new
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    document.body.id = 'home';
    setTimeout(() => {
      document.body.classList.add('animated-page');
      document.body.classList.add('page-loaded');
    }, 1000);



  }, []);



    return (<>
      <div>

        <div>
          <link rel="stylesheet" href="/assets/v2/css/slick.min.css"></link>
          <link rel="stylesheet" href="/assets/v2/css/bootstrap-grid.css"></link>
          <link rel="stylesheet" href="/assets/v2/css/font-awesome.min.css"></link>
          <link rel="stylesheet" href="/assets/v2/css/nice-select.css"></link>
          <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
          <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
          <div className="preloader-cover">
            <div className="preloader">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <header className="header">
            <a href="#" className="nav-btn">
              <span></span>
              <span></span>
              <span></span>
            </a>
            <div className="top-panel">
              <div className="container">
                <div className="top-panel-cover">
                  <ul className="header-cont">
                    <li><a href="tel:+912345687"><i className="fa fa-phone"></i>+91 7720829444</a></li>
                    <li><a href="mailto:support@rentacross.com"><i className="fa fa-envelope" aria-hidden="true"></i>support@rentacross.com</a></li>
                  </ul>
                  <ul className="icon-right-list">
                    <li><a className="header-like" href="#"><i className="fa fa-heart" aria-hidden="true"></i><span>6</span></a></li>
                    <li><a className="header-user" href="#"><i className="fa fa-user" aria-hidden="true"></i></a></li>
                    <li><a className="header-cart" href="#"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="header-menu">
              <div className="container">
                <a href="index.html" className="logo"><img src="/assets/img/logo.png" alt="logo" /></a>
                <nav className="nav-menu">
                  <ul className="nav-list">
                    <li className="dropdown">
                      <a href="#">Home <i className="fa fa-angle-down" aria-hidden="true"></i></a>
                      <ul>
                        <li className="active"><a href="index.html">Home One</a></li>
                        <li><a href="home-two.html">Home Two</a></li>
                      </ul>
                    </li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="shop.html">Shop</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                    <li className="dropdown">
                      <a href="#">Pages <i className="fa fa-angle-down" aria-hidden="true"></i></a>
                      <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="news.html">News</a></li>
                        <li><a href="404.html">Page error 404</a></li>
                      </ul>
                    </li>
                    <li><a href="contacts.html">Contacts</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <HomeSlider></HomeSlider>



          <section className="s-find-bike">
            <div className="container">
              <form className="find-bike-form">
                <h2 className="title">find the bike</h2>
                <ul className="form-wrap">
                  <li>
                    <label>Type</label>
                    <select className="nice-select">
                      <option>Mountain bike</option>
                      <option>Hybrid/Comfort Bike</option>
                      <option>Cyclocross Bike</option>
                      <option>BMX/Trick Bike</option>
                      <option>Road Bike</option>
                      <option>Track Bike</option>
                    </select>
                  </li>
                  <li>
                    <label>Wheel Size</label>
                    <select className="nice-select">
                      <option >20</option>
                      <option>24</option>
                      <option>26</option>
                      <option>27</option>
                      <option>27.5</option>
                      <option>28</option>
                    </select>
                  </li>
                  <li>
                    <label>Brand</label>
                    <select className="nice-select">
                      <option >Pinarello</option>
                      <option>Eddy Merckx</option>
                      <option>Specialized</option>
                      <option>Giant</option>
                      <option>Trek</option>
                      <option>BMC</option>
                    </select>
                  </li>
                  <li><a href="shop.html" className="btn"><span>search</span></a></li>
                </ul>
              </form>
            </div>
          </section>

          <section className="s-category-bicycle">
            <div className="container">
              <div className="slider-categ-bicycle">
                <div className="slide-categ-bicycle">
                  <div className="categ-bicycle-item">
                    <img src="assets/v2/img/categ-2.png" alt="category" />
                    <div className="categ-bicycle-info">
                      <h4 className="title">mountain <br></br>& road bikes</h4>
                      <a href="shop.html" className="btn"><span>view more</span></a>
                    </div>
                  </div>
                </div>
                <div className="slide-categ-bicycle">
                  <div className="categ-bicycle-item">
                    <img src="assets/v2/img/categ-3.png" alt="category" />
                    <div className="categ-bicycle-info">
                      <h4 className="title">bicycle <br></br>spare parts</h4>
                      <a href="shop.html" className="btn"><span>view more</span></a>
                    </div>
                  </div>
                </div>
                <div className="slide-categ-bicycle">
                  <div className="categ-bicycle-item">
                    <img src="assets/v2/img/categ-1.png" alt="category" />
                    <div className="categ-bicycle-info">
                      <h4 className="title">accessories <br></br>& clothing</h4>
                      <a href="shop.html" className="btn"><span>view more</span></a>
                    </div>
                  </div>
                </div>
                <div className="slide-categ-bicycle">
                  <div className="categ-bicycle-item">
                    <img src="assets/v2/img/categ-3.png" alt="category" />
                    <div className="categ-bicycle-info">
                      <h4 className="title">bicycle <br></br>spare parts</h4>
                      <a href="shop.html" className="btn"><span>view more</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-our-advantages" style={{ backgroundImage: 'url(assets/v2/img/bg-advantages.jpg)' }} >
            <span className="mask"></span>
            <div className="container">
              <h2 className="title">Our Advantages</h2>
              <div className="our-advantages-wrap">
                <div className="our-advantages-item">
                  <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-1.svg" alt="icon" />
                  <h5>Free shipping <br></br>from $500</h5>
                </div>
                <div className="our-advantages-item">
                  <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-2.svg" alt="icon" />
                  <h5>Warranty service <br></br>for 3 months</h5>
                </div>
                <div className="our-advantages-item">
                  <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-3.svg" alt="icon" />
                  <h5>Exchange and return <br></br>within 14 days</h5>
                </div>
                <div className="our-advantages-item">
                  <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/advantages-4.svg" alt="icon" />
                  <h5>Discounts for <br></br>customers</h5>
                </div>
              </div>
            </div>
          </section>

          <section className="s-products">
            <div className="container">
              <div className="tab-wrap">
                <div className="products-title-cover">
                  <h2 className="title">our products</h2>
                  <ul className="tab-nav product-tabs">
                    <li className="item" ><span>All</span></li>
                    <li className="item" ><span>Road bike</span></li>
                    <li className="item" ><span>City bike</span></li>
                    <li className="item"><span>BMX bike</span></li>
                  </ul>
                </div>
                <div className="tabs-content">
                  <div className="tab tab1">
                    <div className="row product-cover">
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="top-sale">top sale</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-1.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-2.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Hyper E-Ride Bike 700C <br></br>20+ Mile Range</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="sale">11%</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-3.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Lightweight M370-27speed <br></br>Aluminum Alloy Mantis</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-4.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">New Spring Beach Cruiser <br></br>Bicycle Chrome</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-5.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-6.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Aluminum and Fork <br></br>Mountain Sr-26omg</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-7.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Steel Frame MTB Bike <br></br>with 21 Speed</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-8.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Leopard Rider No Chain <br></br>Mountain Bicycle</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab tab2">
                    <div className="row product-cover">
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-5.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-6.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Aluminum and Fork <br></br>Mountain Sr-26omg</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="top-sale">top sale</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-1.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-2.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Hyper E-Ride Bike 700C <br></br>20+ Mile Range</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="sale">11%</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-3.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Lightweight M370-27speed <br></br>Aluminum Alloy Mantis</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-4.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">New Spring Beach Cruiser <br></br>Bicycle Chrome</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-7.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Steel Frame MTB Bike <br></br>with 21 Speed</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-8.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Leopard Rider No Chain <br></br>Mountain Bicycle</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab tab3">
                    <div className="row product-cover">
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="sale">11%</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-3.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Lightweight M370-27speed <br></br>Aluminum Alloy Mantis</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-4.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">New Spring Beach Cruiser <br></br>Bicycle Chrome</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-5.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-6.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Aluminum and Fork <br></br>Mountain Sr-26omg</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="top-sale">top sale</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-1.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-2.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Hyper E-Ride Bike 700C <br></br>20+ Mile Range</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-7.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Steel Frame MTB Bike <br></br>with 21 Speed</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-8.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Leopard Rider No Chain <br></br>Mountain Bicycle</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab tab4">
                    <div className="row product-cover">
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-5.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-6.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Aluminum and Fork <br></br>Mountain Sr-26omg</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="top-sale">top sale</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-1.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-2.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Hyper E-Ride Bike 700C <br></br>20+ Mile Range</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <span className="sale">11%</span>
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-3.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                              <div className="old-price">$1.799</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Lightweight M370-27speed <br></br>Aluminum Alloy Mantis</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-4.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">New Spring Beach Cruiser <br></br>Bicycle Chrome</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-7.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Steel Frame MTB Bike <br></br>with 21 Speed</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-lg-3">
                        <div className="product-item">
                          <ul className="product-icon-top">
                            <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                          </ul>
                          <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-8.png" alt="product" /></a>
                          <div className="product-item-cover">
                            <div className="price-cover">
                              <div className="new-price">$1.699</div>
                            </div>
                            <h6 className="prod-title"><a href="single-shop.html">Leopard Rider No Chain <br></br>Mountain Bicycle</a></h6>
                            <a href="single-shop.html" className="btn"><span>buy now</span></a>
                          </div>
                          <div className="prod-info">
                            <ul className="prod-list">
                              <li>Frame Size: <span>17</span></li>
                              <li>Class: <span>City</span></li>
                              <li>Number of speeds: <span>7</span></li>
                              <li>Type: <span>Rigid</span></li>
                              <li>Country registration: <span>USA</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-subscribe" style={{ backgroundImage: 'url(assets/v2/img/bg-subscribe.jpg)' }}>
            <span className="mask"></span>
            <span className="subscribe-effect wow fadeIn" data-wow-duration="1s"
              style={{ backgroundImage: 'url(assets/v2/img/subscribe-effect.svg)' }}></span>
            <div className="container">
              <div className="subscribe-left">
                <h2 className="title"><span>Subscribe</span></h2>
                <p>Subscribe us and you won't miss the new arrivals, as well as discounts and sales.</p>
                <form className="subscribe-form">
                  <i className="fa fa-at" aria-hidden="true"></i>
                  <input className="inp-form" type="email" name="subscribe" placeholder="E-mail" />
                  <button type="submit" className="btn btn-form btn-yellow"><span>send</span></button>
                </form>
              </div>
              <img className="wow fadeInRightBlur lazy" data-wow-duration=".8s" data-wow-delay=".3s" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/subscribe-img.png" alt="img" />
            </div>
          </section>

          <section className="s-top-sale">
            <div className="container">
              <h2 className="title">Top sale</h2>
              <div className="row product-cover">
                <div className="col-sm-6 col-lg-3">
                  <div className="product-item">
                    <ul className="product-icon-top">
                      <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                      <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                    </ul>
                    <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-9.png" alt="product" /></a>
                    <div className="product-item-cover">
                      <div className="price-cover">
                        <div className="new-price">$1.699</div>
                        <div className="old-price">$1.799</div>
                      </div>
                      <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                      <a href="single-shop.html" className="btn"><span>buy now</span></a>
                    </div>
                    <div className="prod-info">
                      <ul className="prod-list">
                        <li>Frame Size: <span>17</span></li>
                        <li>Class: <span>City</span></li>
                        <li>Number of speeds: <span>7</span></li>
                        <li>Type: <span>Rigid</span></li>
                        <li>Country registration: <span>USA</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="product-item">
                    <ul className="product-icon-top">
                      <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                      <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                    </ul>
                    <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-10.png" alt="product" /></a>
                    <div className="product-item-cover">
                      <div className="price-cover">
                        <div className="new-price">$1.499</div>
                        <div className="old-price">$1.799</div>
                      </div>
                      <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                      <a href="single-shop.html" className="btn"><span>buy now</span></a>
                    </div>
                    <div className="prod-info">
                      <ul className="prod-list">
                        <li>Frame Size: <span>17</span></li>
                        <li>Class: <span>City</span></li>
                        <li>Number of speeds: <span>7</span></li>
                        <li>Type: <span>Rigid</span></li>
                        <li>Country registration: <span>USA</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="product-item">
                    <ul className="product-icon-top">
                      <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                      <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                    </ul>
                    <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-11.png" alt="product" /></a>
                    <div className="product-item-cover">
                      <div className="price-cover">
                        <div className="new-price">$1.699</div>
                        <div className="old-price">$1.799</div>
                      </div>
                      <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                      <a href="single-shop.html" className="btn"><span>buy now</span></a>
                    </div>
                    <div className="prod-info">
                      <ul className="prod-list">
                        <li>Frame Size: <span>17</span></li>
                        <li>Class: <span>City</span></li>
                        <li>Number of speeds: <span>7</span></li>
                        <li>Type: <span>Rigid</span></li>
                        <li>Country registration: <span>USA</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="product-item">
                    <ul className="product-icon-top">
                      <li><a href="#"><i className="fa fa-refresh" aria-hidden="true"></i></a></li>
                      <li><a href="#"><i className="fa fa-heart" aria-hidden="true"></i></a></li>
                    </ul>
                    <a href="single-shop.html" className="product-img"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/prod-12.png" alt="product" /></a>
                    <div className="product-item-cover">
                      <div className="price-cover">
                        <div className="new-price">$1.499</div>
                        <div className="old-price">$1.799</div>
                      </div>
                      <h6 className="prod-title"><a href="single-shop.html">Granite Peak 24" <br></br>Girls Mountain Bike</a></h6>
                      <a href="single-shop.html" className="btn"><span>buy now</span></a>
                    </div>
                    <div className="prod-info">
                      <ul className="prod-list">
                        <li>Frame Size: <span>17</span></li>
                        <li>Class: <span>City</span></li>
                        <li>Number of speeds: <span>7</span></li>
                        <li>Type: <span>Rigid</span></li>
                        <li>Country registration: <span>USA</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-feedback" style={{ backgroundImage: 'url(assets/v2/img /bg-feedback.jpg)' }}>
            <span className="effwct-bg-feedback" style={{ backgroundImage: 'url(assets/v2/img/effect-bg-feedback.svg)' }}></span>
            <span className="mask"></span>
            <div className="container">
              <h2 className="title">feedback</h2>
              <div className="feedback-slider">
                <div className="feedback-slide">
                  <div className="feedback-item">
                    <div className="feedback-content">
                      <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempoinc ididunt ut magna aliqua dolor sit amet, consectetur adipiscing elit magna”</p>
                    </div>
                    <div className="feedback-item-top">
                      <img src="assets/v2/img/feedback-photo-1.png" alt="photo" />
                      <div className="feedback-title">
                        <h5 className="title"><span>Li piters</span></h5>
                        <ul className="rating">
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-not-bg"><i className="fa fa-star-o" aria-hidden="true"></i></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feedback-slide">
                  <div className="feedback-item">
                    <div className="feedback-content">
                      <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempoinc ididunt ut magna aliqua dolor sit amet, consectetur adipiscing elit magna”</p>
                    </div>
                    <div className="feedback-item-top">
                      <img src="assets/v2/img/feedback-photo-2.png" alt="photo" />
                      <div className="feedback-title">
                        <h5 className="title"><span>Sam Barton</span></h5>
                        <ul className="rating">
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-not-bg"><i className="fa fa-star-o" aria-hidden="true"></i></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feedback-slide">
                  <div className="feedback-item">
                    <div className="feedback-content">
                      <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempoinc ididunt ut magna aliqua dolor sit amet, consectetur adipiscing elit magna”</p>
                    </div>
                    <div className="feedback-item-top">
                      <img src="assets/v2/img/feedback-photo-3.png" alt="photo" />
                      <div className="feedback-title">
                        <h5 className="title"><span>Zoe Tyler</span></h5>
                        <ul className="rating">
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-not-bg"><i className="fa fa-star-o" aria-hidden="true"></i></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feedback-slide">
                  <div className="feedback-item">
                    <div className="feedback-content">
                      <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempoinc ididunt ut magna aliqua dolor sit amet, consectetur adipiscing elit magna”</p>
                    </div>
                    <div className="feedback-item-top">
                      <img src="assets/v2/img/feedback-photo-2.png" alt="photo" />
                      <div className="feedback-title">
                        <h5 className="title"><span>Sam Barton</span></h5>
                        <ul className="rating">
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-bg"><i className="fa fa-star" aria-hidden="true"></i></li>
                          <li className="star-not-bg"><i className="fa fa-star-o" aria-hidden="true"></i></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-our-news">
            <div className="container">
              <h2 className="title">Our News</h2>
              <div className="news-cover row">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="news-item">
                    <h6 className="title"><a href="news.html">doloremque laudantium, totam rem aperiam, eaque ipsa quae</a></h6>
                    <div className="news-post-thumbnail">
                      <a href="news.html"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/news-1.jpg" alt="news" /></a>
                    </div>
                    <div className="meta">
                      <span className="date"><i className="fa fa-calendar" aria-hidden="true"></i> Dec 26,2019</span>
                      <span className="post-by"><i className="fa fa-user" aria-hidden="true"></i> By <a href="#">Samson</a></span>
                    </div>
                    <div className="post-content">
                      <p>Sed ut perspiciatis unde omnis iste natus  sit voluptatem accusantium doloremque lauda ntium, totam rem aperiam, eaque.</p>
                    </div>
                    <a href="news.html" className="btn-news">read more</a>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="news-item">
                    <h6 className="title"><a href="news.html">At vero eos et accusamus et iusto odio dignissimos ducim</a></h6>
                    <div className="news-post-thumbnail">
                      <a href="single-news.html"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/news-2.jpg" alt="news" /></a>
                    </div>
                    <div className="meta">
                      <span className="date"><i className="fa fa-calendar" aria-hidden="true"></i> Dec 26,2019</span>
                      <span className="post-by"><i className="fa fa-user" aria-hidden="true"></i> By <a href="#">Samson</a></span>
                    </div>
                    <div className="post-content">
                      <p>Corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui.</p>
                    </div>
                    <a href="single-news.html" className="btn-news">read more</a>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="news-item">
                    <h6 className="title"><a href="news.html">On the other hand, we denounce with righteous indignation a</a></h6>
                    <div className="news-post-thumbnail">
                      <a href="news.html"><img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/news-3.jpg" alt="news" /></a>
                    </div>
                    <div className="meta">
                      <span className="date"><i className="fa fa-calendar" aria-hidden="true"></i> Dec 26,2019</span>
                      <span className="post-by"><i className="fa fa-user" aria-hidden="true"></i> By <a href="#">Samson</a></span>
                    </div>
                    <div className="post-content">
                      <p>Blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those.</p>
                    </div>
                    <a href="single-news.html" className="btn-news">read more</a>
                  </div>
                </div>
              </div>
              <div className="btn-cover"><a className="btn" href="news.html"><span>view more</span></a></div>
            </div>
          </section>

          <section className="s-clients">
            <div className="container">
              <div className="clients-cover">
                <div className="client-slide">
                  <div className="client-slide-cover">
                    <img src="assets/v2/img/client-1.svg" alt="img" />
                  </div>
                </div>
                <div className="client-slide">
                  <div className="client-slide-cover">
                    <img src="assets/v2/img/client-2.svg" alt="img" />
                  </div>
                </div>
                <div className="client-slide">
                  <div className="client-slide-cover">
                    <img src="assets/v2/img/client-4.svg" alt="img" />
                  </div>
                </div>
                <div className="client-slide">
                  <div className="client-slide-cover">
                    <img src="assets/v2/img/client-5.svg" alt="img" />
                  </div>
                </div>
                <div className="client-slide">
                  <div className="client-slide-cover">
                    <img src="assets/v2/img/client-6.svg" alt="img" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-banner" style={{ backgroundImage: 'url(assets/v2/img/bg-section-banner.jpg)' }}>
            <span className="mask"></span>
            <div className="banner-img">
              <div className="banner-img-bg wow fadeIn" data-wow-duration=".6s" style={{ backgroundImage: 'url(assets/v2/img/effect-section-banner.svg)' }}></div>
              <img className="lazy wow fadeInLeftBlur" data-wow-duration=".8s" data-wow-delay=".3s" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/bike-banner.png" alt="img" />
            </div>
            <div className="container">
              <h2 className="title">Hyper E-Ride Bike 700C</h2>
              <p className="slogan">Maecenas consequat ex id lobortis venenatis. Mauris id erat enim. Morbi dolor dolor, auctor tincidunt lorem.</p>
              <div className="banner-price">
                <div className="new-price">$1.699</div>
                <div className="old-price">$1.799</div>
              </div>
              <div id="clockdiv">
                <div>
                  <span className="days"></span>
                  <div className="smalltext">Days</div>
                </div>
                <div>
                  <span className="hours"></span>
                  <div className="smalltext">Hours</div>
                </div>
                <div>
                  <span className="minutes"></span>
                  <div className="smalltext">Minutes</div>
                </div>
                <div>
                  <span className="seconds"></span>
                  <div className="smalltext">Seconds</div>
                </div>
              </div>
            </div>
          </section>

          <section className="s-instagram">
            <div className="instagram-cover">
              <a href="#" className="instagram-item">
                <ul>
                  <li className="comments">234 <i className="fa fa-comment-o" aria-hidden="true"></i></li>
                  <li className="like">134 <i className="fa fa-heart-o" aria-hidden="true"></i></li>
                </ul>
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/instagram-1.jpg" alt="img" />
              </a>
              <a href="#" className="instagram-item">
                <ul>
                  <li className="comments">222 <i className="fa fa-comment-o" aria-hidden="true"></i></li>
                  <li className="like">118 <i className="fa fa-heart-o" aria-hidden="true"></i></li>
                </ul>
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/instagram-2.jpg" alt="img" />
              </a>
              <a href="#" className="instagram-item">
                <ul>
                  <li className="comments">224 <i className="fa fa-comment-o" aria-hidden="true"></i></li>
                  <li className="like">124 <i className="fa fa-heart-o" aria-hidden="true"></i></li>
                </ul>
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/instagram-3.jpg" alt="img" />
              </a>
              <a href="#" className="instagram-item">
                <ul>
                  <li className="comments">155 <i className="fa fa-comment-o" aria-hidden="true"></i></li>
                  <li className="like">107 <i className="fa fa-heart-o" aria-hidden="true"></i></li>
                </ul>
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/instagram-4.jpg" alt="img" />
              </a>
              <a href="#" className="instagram-item">
                <ul>
                  <li className="comments">350 <i className="fa fa-comment-o" aria-hidden="true"></i></li>
                  <li className="like">140 <i className="fa fa-heart-o" aria-hidden="true"></i></li>
                </ul>
                <img className="lazy" src="assets/v2/img/placeholder-all.png" data-src="assets/v2/img/instagram-5.jpg" alt="img" />
              </a>
            </div>
          </section>

          <footer>
            <div className="container">
              <div className="row footer-item-cover">
                <div className="footer-subscribe col-md-7 col-lg-8">
                  <h6>subscribe</h6>
                  <p>Subscribe us and you won't miss the new arrivals, as well as discounts and sales.</p>
                  <form className="subscribe-form">
                    <i className="fa fa-at" aria-hidden="true"></i>
                    <input className="inp-form" type="email" name="subscribe" placeholder="E-mail" />
                    <button type="submit" className="btn btn-form"><span>send</span></button>
                  </form>
                </div>
                <div className="footer-item col-md-5 col-lg-4">
                  <h6>info</h6>
                  <ul className="footer-list">
                    <li><a href="shop.html">FAQ</a></li>
                    <li><a href="shop.html">Contacts</a></li>
                    <li><a href="shop.html">Shipping + Heading</a></li>
                    <li><a href="shop.html">Exchanges</a></li>
                    <li><a href="shop.html">2019 Catalog</a></li>
                    <li><a href="shop.html">Returns</a></li>
                    <li><a href="shop.html">Search</a></li>
                  </ul>
                </div>
              </div>
              <div className="row footer-item-cover">
                <div className="footer-touch col-md-7 col-lg-8">
                  <h6>stay in touch</h6>
                  <ul className="footer-soc social-list">
                    <li><a target="_blank" href="https://www.facebook.com/rovadex"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                    <li><a target="_blank" href="https://twitter.com/RovadexStudio"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                    <li><a target="_blank" href="https://www.instagram.com/rovadex"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                    <li><a target="_blank" href="https://www.youtube.com"><i className="fa fa-youtube-play" aria-hidden="true"></i></a></li>
                  </ul>
                  <div className="footer-autor">Questions? Please write us at: <a href="mailto:rovadex@gmail.com">rovadex@gmail.com</a></div>
                </div>
                <div className="footer-item col-md-5 col-lg-4">
                  <h6>shop</h6>
                  <ul className="footer-list">
                    <li><a href="shop.html">Road Bike</a></li>
                    <li><a href="shop.html">City Bike</a></li>
                    <li><a href="shop.html">Mountain Bike</a></li>
                    <li><a href="shop.html">Kids Bike</a></li>
                    <li><a href="shop.html">BMX Bike</a></li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <div className="footer-copyright"><a target="_blank" href="https://rovadex.com">Rovadex</a> © 2019. All Rights Reserved.</div>
                <ul className="footer-pay">
                  <li><a href="#"><img src="assets/v2/img/footer-pay-1.png" alt="img" /></a></li>
                  <li><a href="#"><img src="assets/v2/img/footer-pay-2.png" alt="img" /></a></li>
                  <li><a href="#"><img src="assets/v2/img/footer-pay-3.png" alt="img" /></a></li>
                  <li><a href="#"><img src="assets/v2/img/footer-pay-4.png" alt="img" /></a></li>
                </ul>
              </div>
            </div>
          </footer>

          <a className="to-top" href="#home">
            <i className="fa fa-angle-double-up" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </>)



  // old
  // return (
  //   <AppLayout sidebar={false}>
  //     <Content>
  //       <ProductGrid></ProductGrid>
  //     </Content>
  //   </AppLayout>
  // )
}
