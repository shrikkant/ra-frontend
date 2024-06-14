
import 'styles/global.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>RentAcross | Online rental platform for photography and camping equipment.</title>
        <meta property="og:title" content="RentAcross | Online rental platform for photography and camping equipment." key="title" />
        <meta property="og:site_name" content="RentAcross" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://labs.rentacross.com" />
        <meta name="description"
          content="Rent DSLR Cameras, Lenses, Camping Equipment & More. Premium Quality. Affordable Rates. Hassle free renting." />
        <meta name="keywords"
          content="Rent DSLR Cameras, Rent GoPro, Rent Video Cameras, Rent DSLR Lenses, Camera Rental Community, Online Camera Rental Store" />

        <link rel="stylesheet" href="/assets/v2/css/slick.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/bootstrap-grid.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/font-awesome.min.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/nice-select.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/animate.css"></link>
        <link rel="stylesheet" href="/assets/v2/css/style.css"></link>
      </head>
      <body className="inner-scroll" id="home">
        <div className="preloader-cover">
          <div className="preloader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
