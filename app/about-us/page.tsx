import React from "react";
import PageContainer from "../../components/common/PageContainer";
import { PageTitle } from "../../components/common/PageTitle";

export default async function Page() {

  return (<><PageTitle title={"About Us"} />
      <PageContainer>
      <div className="font-sans max-w-4xl mx-auto">
      {/* Who We Are Section */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4">Who We Are</h1>
        <p className="text-lg text-gray-700">
          At Rentacross, we believe everyone deserves access to the tools they need to tell their story, whether it’s through stunning photography or captivating videos. Our mission is simple: to make high-quality photography gear accessible, affordable, and available to everyone, especially photographers, travelers, and students.
        </p>
      </div>

      {/* Our Mission Section */}
      <div className="bg-yellow-200 py-8 rounded-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img alt="Camera in hand" className="rounded-lg" src="/assets/v2/img/about-us-image.png" />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h2 className="text-xl font-bold mb-4">Our mission</h2>
            <p className="text-lg text-gray-700">
              To bridge the gap between creativity and resources, empowering individuals to capture life’s best moments with professional-grade gear at affordable prices.
            </p>
          </div>
        </div>
      </div>
    </div>

      {/* Our Vision Section */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700">
          To build a vibrant creative community, inspired by the founder’s values of resilience, innovation, and passion for exploration. Rentacross strives to be the go-to platform for photographers and storytellers, helping them turn fleeting moments into lasting memories.
        </p>
      </div>
      </div>
      </PageContainer>
  </>)
}
