import {p, h2, bullet, numbered, em, strong} from '../../blog/lib/pt.mjs'

export const data = {
  citySlug: 'mumbai',
  subCategorySlug: 'rent-camera',

  seoTitle:
    'Camera Rental in Mumbai — DSLR, Mirrorless, GoPro | RentAcross',
  seoDescription:
    'Rent DSLR, mirrorless and GoPro cameras in Mumbai from Canon, Sony, Nikon and Fujifilm. Daily, weekly and monthly. Free home delivery across Bandra, Andheri, Powai, Lower Parel and Navi Mumbai.',

  customH1: 'Camera Rental in Mumbai',

  customIntro:
    `Cameras built for the way Mumbai shoots — fast, low-light, monsoon-proof. Canon, Sony, Nikon, Fujifilm. From ₹300 a day. Free home delivery across the western and central suburbs. Pick up before the shoot. Drop after.`,

  body: [
    h2('Why people rent cameras in Mumbai'),
    p(
      `Mumbai is the city where most cameras in this country actually go to work. Wedding seasons, ad shoots, content sets, news, weekend street walks at Marine Drive, Bandra Fort at golden hour, Sassoon Dock at five in the morning. The volume of shooting that happens here every weekend is wild.`,
    ),
    p(
      `Most of it doesn't need owning a camera. It needs renting the right one for two days, returning it, and getting back to your day job. That's where we come in.`,
    ),

    h2('What we have in stock in Mumbai'),
    bullet(
      strong(`DSLR & mirrorless `),
      `— Canon EOS R6, Sony A7C, Sony A7III, A7IV, Nikon Z6, Fujifilm X-T4 / X-T5.`,
    ),
    bullet(
      strong(`Lenses `),
      `— 50mm and 85mm primes, 24-70 f/2.8 zooms, 70-200 f/2.8 telephotos, 16-35 wides. Cine lenses available on request.`,
    ),
    bullet(
      strong(`Action & travel `),
      `— GoPro HERO12, DJI Osmo Pocket 3, Insta360 X3 and X4.`,
    ),
    bullet(
      strong(`Lighting `),
      `— Godox AD200, AD600, V1 speedlights, continuous LED panels and softboxes.`,
    ),
    bullet(
      strong(`Stabilizers `),
      `— DJI Ronin gimbals, monopods, tripods, sliders.`,
    ),
    p(
      `Daily DSLRs from ₹300. Pro mirrorless from ₹800. Cinema kits priced on request.`,
    ),

    h2('How rental works'),
    numbered(
      strong(`Pick on the site. `),
      `Daily, weekly or monthly. Longer rentals are cheaper per day.`,
    ),
    numbered(
      strong(`Add ID + KYC. `),
      `One time. Aadhaar + a selfie. We're a small team handing over real kit; we ask once.`,
    ),
    numbered(
      strong(`Free delivery in Mumbai. `),
      `Bandra, Andheri, Powai, Lower Parel, BKC, Worli, Juhu, Goregaon, Malad, Borivali, Navi Mumbai. Time slot of your choosing.`,
    ),
    numbered(
      strong(`Shoot. `),
      `That's the point.`,
    ),
    numbered(
      strong(`Return. `),
      `We pick up. Same way it came.`,
    ),

    h2('Honest answers'),
    p(
      `We've been doing this in Mumbai a while. The same questions come up. Here's the short version of what we tell first-timers:`,
    ),
    bullet(
      strong(`I'm shooting a wedding next week — what should I rent? `),
      `Two bodies (one main + one backup), 24-70 f/2.8, 70-200 f/2.8, two speedlights, extra batteries, a 256GB card or two. We can put a kit together; just message us with the dates.`,
    ),
    bullet(
      strong(`I'm doing my first content shoot — do I need a pro setup? `),
      `Probably not. A Sony A7C with a 35mm prime gets you 90% of the way there. Add one continuous LED if you're shooting indoors.`,
    ),
    bullet(
      strong(`Can I rent for one day only? `),
      `Yes. Many DSLRs are ₹300/day. A wedding rig with two bodies and three lenses is more.`,
    ),
    bullet(
      strong(`What if it rains? `),
      `It's Mumbai. Bring a rain cover (we can include one). Most modern bodies handle drizzle. Keep the lens hood on.`,
    ),

    p(
      strong(`Bottom line: `),
      `the gear isn't the bottleneck. The shoot is. Rent what you need, return when you're done.`,
    ),
  ],

  faqOverrides: [
    {
      question: 'Do you deliver cameras in Bandra and Andheri?',
      answer: [
        p(
          `Yes — Bandra, Andheri, Powai, Lower Parel, BKC, Worli, Juhu, Goregaon, Malad, Borivali, Navi Mumbai, Thane. Delivery inside Mumbai is free. Outer Thane and Vasai-Virar are a small fee.`,
        ),
      ],
    },
    {
      question: `What's the deposit on a camera rental in Mumbai?`,
      answer: [
        p(
          `Most rentals are zero-deposit once your KYC is done. For high-value gear (cinema cameras, RED rigs, 70-200 f/2.8 lenses, Ronins) we collect a refundable deposit which is returned the same day we pick up the gear.`,
        ),
      ],
    },
    {
      question: 'Can I rent a camera for a wedding in Mumbai?',
      answer: [
        p(
          `Yes — wedding kits are one of the most common rentals. We can put together two bodies, fast f/2.8 zooms, two speedlights, batteries and cards. Book a few days ahead during peak season (October to February).`,
        ),
      ],
    },
  ],
}
