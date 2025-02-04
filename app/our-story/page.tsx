import React from "react";
import PageContainer from "../../components/common/PageContainer";
import { PageTitle } from "../../components/common/PageTitle";

export default async function Page() {

  return (<><PageTitle title={"Our Story"} />
      <PageContainer>
      <div className="font-sans max-w-4xl mx-auto">
      {/* Who We Are Section */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4">Our Story</h1>
        <p className="text-lg text-gray-700">
        Every great picture tells a story, and so does Rentacross.
It all began with a traveler, a tech enthusiast, and a dreamer—someone who grew up in the fields of a farming family, learning the value of hard work, resilience, and the beauty of simplicity. Armed with a love for technology and a passion for exploring the world, our founder realized something during their adventures: great moments deserve great gear, but not everyone can afford it.
Why should creativity be limited by cost? That question sparked an idea.
With a vision to empower photographers, storytellers, and adventurers, Rentacross was born. It’s more than just a rental platform—it’s a bridge connecting creators to possibilities. We wanted to ensure that a student practicing photography, a traveler capturing their journey, or a professional perfecting their craft could all have access to the best tools without breaking the bank.
</p>
      </div>

      {/* Our Goal Section */}
      <div className="rounded-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img alt="Camera in hand" className="rounded-lg" src="/assets/v2/img/our-story-lake.jpeg" />
          </div>
          <div className="md:w-2/3 md:pl-6">
            <p className="text-lg text-gray-700">
            But Rentacross isn’t just about renting cameras and lenses—it’s about building a community. A space where creativity thrives, where people share their passion for storytelling, and where every frame tells a story worth remembering.
So here we are, with a platform where creators like you can thrive.
Your vision, our gear. Together, let’s tell incredible stories.
</p>
          </div>
        </div>
      </div>
    </div>

      {/* Join Us Section */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-4">Join Us!</h2>
        <p className="text-lg text-gray-700">
        At Rentacross, we don’t just provide gear; we provide opportunities to create, share, and grow. Whether you’re on an epic adventure, documenting the beauty of everyday life, or learning the ropes, we’re here to help you every step of the way.
        </p>
      </div>
      </div>
      </PageContainer>
  </>)
}
