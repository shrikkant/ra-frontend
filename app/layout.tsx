import { Metadata } from 'next'

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
