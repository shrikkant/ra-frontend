import React from "react";

export default function HowItWorks() {
  return (

  <section className="bg-gray-100">
    <div className="flex flex-col items-center w-full py-16 px-6 sm:px-16">
      
      {/* Heading Section */}
      <div className="relative flex py-5 items-center w-full mx-auto max-w-screen-lg">
        <div className="flex-grow border-t-2 border-gray-400"></div>
        <span className="flex-shrink mx-4 font-bold text-2xl text-black">How it Works</span>
        <div className="flex-grow border-t-2 border-gray-400"></div>
      </div>

      {/* Main Content Section (Video + Diagram) */}
      <div className="flex flex-col sm:flex-row mx-auto justify-center items-center w-full max-w-screen-lg space-y-8 sm:space-y-0 sm:space-x-8">
        
        {/* Video Section with Aspect Ratio */}
        <div className="w-full sm:w-1/2 aspect-w-16 aspect-h-9 mb-8 sm:mb-0">
          <video className="w-full h-full object-cover rounded-lg" controls>
            <source src="/assets/v2/img/intro-video-about-process.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* How It Works Diagram Section */}
        <div className="w-full sm:w-1/2 aspect-w-3 aspect-h-4 h-auto flex justify-center items-center">
          <div className="text-center">
            <img src="/assets/v2/img/process-steps-mobile-view-image-black.png" alt="How it Works Diagram" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

    </div>
  </section>



//  Otion2 -horizontal and vertical 
//  <section>
//        <div className="border-t-2 border-gray-200 px-10 mt-10 mx-20"></div>
//        <div className="mx-auto text-center font-semibold text-2xl my-10 text-[#f7ca00]">How it Works</div>
//       <img 
//         src="/assets/v2/img/process-steps-mobile-view-image-yellow.png"
//         alt="How it Works Diagram"
//         className="block ml-4 w-full md:hidden" // Visible only on small screens
//       />
      
//        Image for large screens 
//       <img 
//         src="/assets/v2/img/process-steps-mobile-view-image-black.png"
//         alt="How it Works Diagram"
//         className="hidden md:block mx-auto" // Visible only on medium and larger screens
//       />
//       </section> 



);

}
