import React from "react";
import PageContainer from "../../components/common/PageContainer";
import { PageTitle } from "../../components/common/PageTitle";


export default async function Page() {
  return (<><PageTitle title={"Why Us"} />
      <PageContainer>
      <div className="flex flex-col font-sans max-w-4xl mx-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4">Why Choose Us</h1>
        <p className="text-lg text-gray-700">
          At Rentacross, we believe everyone deserves access to the tools they need to tell their story, whether it’s through stunning photography or captivating videos. Our mission is simple: to make high-quality photography gear accessible, affordable, and available to everyone, especially photographers, travelers, and students.
        </p>
      </div>
      <b className="max-w-4xl px-6 py-8 text-xl font-bold text-gray-700">Here’s why creators, adventurers, and learners choose us </b>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 md:pl-6 mb-4 md:mb-0">
        <ul className="pr-2">
            <li>
              <strong>Premium Gear for All:</strong> Cameras, lenses, lighting, and
              more curated for professionals, hobbyists, and learners.
            </li>
            <li>
              <strong>Affordable Rates:</strong> We prioritize accessibility,
              ensuring quality doesn’t come with a high price tag.
            </li>
            <li>
              <strong>Community-Oriented:</strong> Rentacross is more than a rental
              service; we’re a growing network of creators who inspire and support
              each other.
            </li>
            <li>
              <strong>For the Dreamers:</strong> Whether you’re a traveler
              documenting adventures, a student exploring photography, or a
              professional refining your craft, we’re here for you.
            </li>
          </ul>
          </div>
          <div className="md:w-1/3 mb-6 md:mb-0">
          <img
            src="/assets/v2/img/why-us-image.png" // Update the image path accordingly
            alt="People sharing camera equipment"
          />
          </div>
        
        </div>
      </div>


      </div>
      </PageContainer>
</>
  )
  }
  