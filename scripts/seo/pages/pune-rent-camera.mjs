import {p, h2, bullet, numbered, em, strong} from '../../blog/lib/pt.mjs'

export const data = {
  citySlug: 'pune',
  subCategorySlug: 'rent-camera',

  seoTitle:
    'Camera Rental in Pune — DSLR, Mirrorless, GoPro | RentAcross',
  seoDescription:
    'Rent DSLR, mirrorless and GoPro cameras in Pune from Canon, Sony, Nikon and Fujifilm. Daily, weekly and monthly plans. Free home delivery across Koregaon Park, Aundh, Kothrud and Baner.',

  customH1: 'Camera Rental in Pune',

  customIntro:
    `Cameras you actually want to shoot with — Canon, Sony, Nikon, Fujifilm — for as little as ₹300 a day. Free home delivery across Pune. Pick up Friday, return Monday. No deposit drama.`,

  body: [
    h2('Why people rent cameras in Pune'),
    p(
      `Pune is a strange and lovely city to make pictures in. Sinhagad at sunrise. The dome of Shaniwar Wada at golden hour. Mandai before the crowd lands. Tulshi Baug on a Sunday. The shooting is one of the few things this city gives you for free — but the gear that does it justice is expensive.`,
    ),
    p(
      `That's the gap we exist to fill. You need a camera for a weekend, a wedding, a college shoot, a travel trip — you don't want to drop ₹70,000 to find out you'd rather be shooting on your phone after a month. So you rent.`,
    ),

    h2('What we have in stock in Pune'),
    bullet(
      strong(`DSLR & mirrorless `),
      `— Canon EOS series, Sony A7C / A7III / A6400, Nikon Z6, Fujifilm X-T.`,
    ),
    bullet(
      strong(`Lenses `),
      `— 50mm f/1.8 primes, 24-70mm zooms, 70-200mm telephotos, 16-35mm wides.`,
    ),
    bullet(
      strong(`Action & travel `),
      `— GoPro HERO12, DJI Osmo, 360 cameras.`,
    ),
    bullet(
      strong(`Lighting `),
      `— Godox speedlights, continuous LED panels, softboxes.`,
    ),
    bullet(
      strong(`Stabilizers `),
      `— DJI Ronin gimbals, monopods, tripods.`,
    ),
    p(
      `Pricing varies by kit. Most DSLRs from ₹300/day. Most pro mirrorless from ₹800/day. Cinema-grade rigs priced on request.`,
    ),

    h2('How rental works'),
    numbered(
      strong(`Pick on the site. `),
      `Daily, weekly or monthly. The longer you keep it, the cheaper it gets per day.`,
    ),
    numbered(
      strong(`Add ID + KYC. `),
      `One time. Aadhaar + a selfie. We're a small team and we're handing over expensive kit, so we ask once.`,
    ),
    numbered(
      strong(`Free delivery in Pune. `),
      `Koregaon Park, Aundh, Kothrud, Baner, Viman Nagar, Wakad, Hadapsar — anywhere inside the city. Time slot of your choosing.`,
    ),
    numbered(
      strong(`Shoot. `),
      `That's the whole point.`,
    ),
    numbered(
      strong(`Return. `),
      `We pick up. Same way it came.`,
    ),

    h2('Honest answers'),
    p(
      `We've been doing this in Pune for a while. The same questions come up. Here's what we tell people who walk in for the first time:`,
    ),
    bullet(
      strong(`Do I need to be a pro? `),
      `No. Most of our renters are weekend hobbyists or people doing their first shoot. We won't quiz you.`,
    ),
    bullet(
      strong(`Does it come fully charged with cards? `),
      `Yes. Always. With at least one spare battery and an SD card already in the slot.`,
    ),
    bullet(
      strong(`What if I drop it? `),
      `Tell us, don't hide it. We work it out — there's a damage policy on every rental, but it's not designed to ruin your day.`,
    ),
    bullet(
      strong(`Can I rent for one day only? `),
      `Yes. Many of our DSLRs are ₹300 for a day. A wedding videographer's rig is more.`,
    ),

    p(
      strong(`Bottom line: `),
      `if Pune is the city you want to photograph, the camera shouldn't be the part stopping you.`,
    ),
  ],

  faqOverrides: [
    {
      question: 'Do you deliver cameras in Koregaon Park and Aundh?',
      answer: [
        p(
          `Yes — Koregaon Park, Aundh, Baner, Kothrud, Viman Nagar, Wakad, Hadapsar, Camp, FC Road, Hinjawadi. Most addresses inside Pune are free. We also drop to PCMC for a small fee.`,
        ),
      ],
    },
    {
      question: `What's the deposit on a camera rental in Pune?`,
      answer: [
        p(
          `Most rentals are zero-deposit once your KYC is done. For high-value rigs (cinema cameras, 70-200 f/2.8 lenses, etc.) we collect a refundable deposit which is returned the same day we pick up the gear.`,
        ),
      ],
    },
    {
      question: 'Can I rent a camera for one day in Pune?',
      answer: [
        p(
          `Yes. One day, two days, a week, a month. Daily rates start around ₹300 and go up depending on the kit.`,
        ),
      ],
    },
  ],
}
