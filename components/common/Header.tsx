export default function Header() {



  return (<div>
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
  </header></div>);

}
