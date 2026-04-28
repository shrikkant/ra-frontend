import { p, h2, h3, bullet, numbered, image, em, strong, link } from '../lib/pt.mjs'

export const meta = {
  slug: 'photography-courses-in-pune',
  title: `Photography Courses in Pune: An Honest Guide for Anyone Who's Never Held a "Real" Camera`,
  shortDesc: `An honest, slightly opinionated guide to photography courses in Pune — institutions, workshops, communities, and what nobody tells you about actually learning photography in this city.`,
  heroImage: 'hero',
  heroAlt: 'A photographer with a camera on a busy Indian street',
}

export const images = {
  hero:      { pexelsId: 28926424 },
  workshop:  { pexelsId: 15380343 },
  gallery:   { pexelsId: 11489976 },
  lens:      { pexelsId: 11884527 },
  photowalk: { pexelsId: 18414619 },
  street:    { pexelsId: 16591972 },
}

export function buildBody(img) {
  return [
    p(
      `Pune doesn't have a shortage of photography courses. Walk through Koregaon Park on any Saturday morning and you'll bump into three people teaching one. The problem isn't supply. The problem is figuring out which one is for `,
      em('you'),
      ` — when you've never even held a camera with a real shutter.`,
    ),

    p(
      `I've been on the receiving end of "you should learn photography" for years. From friends, from family — `,
      em(`"you click such nice pictures on your phone, take a course no?"`),
      ` Sound familiar?`,
    ),

    p(`So I went looking. And what I found was — well, a lot of marketing. Here's the honest version. Real institutions, real prices, and the parts nobody puts on the brochure.`),

    h2(`First, the uncomfortable question`),
    p(`Do you actually need a course?`),
    p(`Most "I bought a camera" stories end the same way. The camera lives on a shelf for two years. Then it gets sold on OLX for half the price. A course doesn't fix that.`),
    p(`What fixes it is shooting. Every. Single. Day.`),
    p(
      `But — and there's a `, em('but'),
      ` — courses do something self-learning doesn't. They put a deadline on your ambition. They put strangers in the same room as you and your half-formed ideas. That's the whole value. You're paying for the structure, not the secrets.`,
    ),
    p(`If you already take 200 photos a week on your phone — yes, take a course. You're ready.`),
    p(`If you bought a camera last week and haven't taken it out — skip the course. Go shoot for a month first.`),

    h2(`The Pune photography landscape: who actually teaches what`),

    image(img.gallery, 'Photographs displayed at a contemporary art gallery exhibit'),

    p(`Pune is genuinely one of the better cities in India to learn photography. There's a rare overlap of three things — a real film institute, multiple design and media schools, and a healthy ecosystem of working photographers running their own classes. Most other cities have one or two of those. Pune has all three.`),

    p(`Here's a quick map. Specifics like fees and batch dates change — always verify on the official website before applying.`),

    h3(`Formal programs (the ones with a real campus and a real certificate)`),

    p(
      strong(`FTII — Film and Television Institute of India.`),
      ` Law College Road. Yes, `, em('that'), ` FTII. The one you've seen on news debates. They run short courses in still photography (a few weeks to a few months long), and the larger film and TV programs touch photography too. Application-based, intentionally selective. The certificate has weight, but honestly, the bigger value is who's sitting next to you. Documentary filmmakers, indie cinematographers, journalists. The conversations are the curriculum.`,
    ),

    p(
      strong(`Symbiosis Institute of Design (SID).`),
      ` Viman Nagar. A four-year Bachelor's in Design with photography embedded in the curriculum. Right path if you're 18 and you can see yourself in fashion, product, or editorial photography down the line. Not a "weekend hobby" route — full degree, design-school price tag.`,
    ),

    p(
      strong(`Symbiosis Institute of Media and Communication (SIMC).`),
      ` Lavale. Photojournalism is part of the broader media programs. The right place if you want to shoot for newspapers, magazines, NGOs, or longform digital publications. The wrong place if you want to shoot weddings.`,
    ),

    p(
      strong(`MIT Institute of Design (MIT-ID).`),
      ` Loni Kalbhor. Similar landscape to SID — design-led, undergraduate, photography woven through. Worth comparing portfolios and faculty side-by-side with Symbiosis if you're choosing between the two.`,
    ),

    p(
      strong(`Sir J.J. Institute of Applied Art (Mumbai).`),
      ` Technically not Pune, but a 3-hour Expressway away. Worth knowing if you're considering applied art with photography as a serious component. People drive for less.`,
    ),

    p(`There are also a handful of fine-arts and applied-arts programs at Bharati Vidyapeeth, Abhinav Kala Mahavidyalaya and similar institutions where photography exists as part of a larger course. Useful if you want photography as a skill, not as the main job.`),

    h3(`Independent academies and studios`),

    p(`Pune has dozens of small academies and working photographers running classes out of Aundh, Kothrud, Baner, and Koregaon Park. Quality is wildly variable. Some are excellent. Some are hobbyists pretending. The marketing all looks the same — "learn from industry experts, build a portfolio, become a pro photographer."`),

    p(`Easy filter — ask for the instructor's published portfolio. If they hesitate, walk. A working photographer will hand you their Instagram in three seconds. A part-time hobbyist will tell you about their "approach to teaching".`),

    h3(`The workshop circuit`),

    p(`These are 2-day to 2-week formats. No degree. No piece of paper that matters to your parents. But the most useful structure for hobbyists.`),

    bullet(strong(`Camera-brand workshops `), `— Sony, Canon, Nikon, Fujifilm all run free or low-cost workshops in metros, including Pune. Excellent introductions, light on sales pressure if you go in clear-eyed. Just don't let the rep upsell you a body on day one.`),
    bullet(strong(`Genre masterclasses `), `— wedding photographers in their off season, food and product photographers running cafe-based workshops, wildlife photographers leading weekend trips to nearby sanctuaries. Good once you know what you want to shoot.`),
    bullet(strong(`Travel + photography retreats `), `— heritage walks in Hampi, monsoon trails in Konkan, wildlife in Tadoba. Many start or end in Pune. Pricey. But you learn more in five days of disciplined shooting than in two months of evening classes.`),

    h3(`College clubs and free options (criminally underrated)`),

    p(`Fergusson, BMCC, COEP, and most Symbiosis colleges have photography clubs. Guest lectures, photo walks, exhibitions, college fests. Often open to outsiders if you ask politely. You won't get a certificate — but you'll get critique, friends with cameras, and a reason to show up on Sundays.`),

    h2(`What a good photography course should actually teach you`),

    p(`If a course is going to be worth your money, it has to cover four buckets. Most cover one or two and hand-wave the rest.`),

    bullet(strong(`Fundamentals. `), `Aperture, ISO, shutter speed, exposure triangle, focal length, depth of field. This is the boring part. Your phone has been hiding it from you for years.`),
    bullet(strong(`Seeing. `), `Composition, light, timing, story. Much harder than fundamentals. Most courses skip it because it's hard to grade.`),
    bullet(strong(`Post-production. `), `Lightroom or Capture One. Colour, contrast, cropping, basic retouching. A photo isn't finished when you press the shutter. Many "professional" courses still under-teach this.`),
    bullet(strong(`Working in a genre. `), `Pick one — street, portrait, product, wedding, wildlife, fashion. Spend half the course there. Generic "all genres" curriculums make generic photographers.`),

    p(`Bonus, rarely included: how to price your work, how to handle clients, how to read a contract. If a course covers `, em('that'), `, sign up immediately.`),

    h2(`Five questions to ask any course before you pay`),

    numbered(strong(`Who teaches it? `), `Not the academy — the actual instructor for your batch. Names, please.`),
    numbered(strong(`Show me their portfolio. `), `Not a slideshow of "student work" — `, em(`the instructor's`), ` published photos. If you're paying ₹40,000, you're paying for their eye.`),
    numbered(strong(`Batch size? `), `Anything over 15 is a lecture, not a class. Anything over 25 is a webinar in a room.`),
    numbered(strong(`How many hours of supervised shooting? `), `Not "we cover X topics". Hours-with-camera-in-hand. That's the only number that matters.`),
    numbered(strong(`What happens after the course? `), `Portfolio review? Alumni network? Or do they ghost you the day after the certificate?`),

    p(`If they fumble two of those five — keep looking.`),

    h2(`How to pick (the brutal cheat sheet)`),
    bullet(strong(`Total beginner? `), `Start with a 2-3 day weekend workshop. Low commitment, high signal. ₹3,000–₹8,000 range. If you hate it, you've lost a weekend, not a quarter.`),
    bullet(strong(`Already shooting hobby? `), `Skip the basics. Find a niche workshop — street, portrait, wildlife, food. Generic "photography 101" courses will bore you and slow you down.`),
    bullet(strong(`Want to go pro? `), `Look for portfolio-driven programs, not certificate-driven ones. Nobody hires you because you have a certificate. They hire you because of the photos in your folder.`),
    bullet(strong(`Want to do this for a living? `), `FTII, a long-form (6+ months) program, or a 4-year design school. And then five years of unpaid hustle. Nobody told me that part either.`),

    h2(`The gear thing nobody talks about`),

    image(img.lens, 'Close-up of a professional camera lens'),

    p(`You'll be tempted to buy a camera. Don't. Not yet.`),
    p(`Here's the trap — you buy a ₹70,000 mirrorless because your course "needs" one. You shoot for a month. You realize you're more interested in street than landscape. Now you've over-invested in gear that doesn't suit your style.`),
    p(`Better path:`),
    bullet(strong(`Borrow `), `from a friend who already has one.`),
    bullet(
      strong(`Rent. `),
      `That's literally why `, link('https://rentacross.com', 'RentAcross'),
      ` exists. Rent a Sony A7C for a weekend. Rent a 50mm prime for a wedding. See what you actually `, em('like'), ` before you buy.`,
    ),
    bullet(strong(`Then buy. `), `Once you've shot ~5,000 frames and you know what you actually want.`),
    p(`(Yes — this is a plug. We rent cameras and lenses across India, including Pune. Skip the ₹70,000 commitment.)`),

    h2(`What you'll actually learn (vs. what you think you'll learn)`),
    p(`You think you're going to learn aperture, ISO, shutter speed.`),
    p(`You'll actually learn:`),
    bullet(`How to wait.`),
    bullet(`How to see.`),
    bullet(`How to spend two hours in one location for one good frame and not feel cheated.`),
    bullet(`How to fail in front of strangers and not crumble.`),
    bullet(`How to delete 90% of what you shoot without flinching.`),
    p(`The technical stuff is a weekend's worth of YouTube. The rest takes years.`),

    h2(`Photography communities and meetups in Pune`),

    image(img.photowalk, 'A diverse group of adults gathers for a photowalk on Indian city streets'),

    p(`The most underrated photography education in this city is free. It's also where you'll meet the friends who'll keep you shooting after the course is over.`),

    bullet(strong(`Photo walks. `), `Search Meetup, Eventbrite, and Instagram for "Pune photo walk". Common spots — Sinhagad Fort at sunrise, Mandai market, Tulshi Baug, Aga Khan Palace, the synagogue and old buildings in Camp, Koregaon Park lanes. Most are free or under ₹500.`),
    bullet(strong(`College photography fests. `), `Symbiosis, MIT-ID, Fergusson, COEP all hold annual photography events. Submission categories, exhibitions, guest photographers. Even if you don't compete, attending is free education.`),
    bullet(strong(`Facebook and WhatsApp groups. `), `"Pune Photographers", "Pune Photographers Club", and dozens of smaller niche groups. Critique threads are gold if you're willing to take notes and not get defensive.`),
    bullet(strong(`Instagram tags. `), `#punephotography, #punediaries, #streetsofpune. Easiest way to find local shooters whose work you respect — and to follow people you'll later run into at a workshop.`),
    bullet(strong(`Coffee shops doubling as galleries. `), `Several cafes in Koregaon Park, Aundh, and Baner rotate small photography exhibitions. Great places to see work in print, talk to the photographer, and start understanding what "good" looks like at A3 size.`),

    h2(`A short, opinionated path for someone starting today`),
    numbered(strong(`Week 1-2 `), `— Take your phone to Sinhagad Road, FC Road, Aga Khan Palace, Mandai. Shoot every day. No course yet.`),
    numbered(strong(`Week 3-4 `), `— Watch one Sean Tucker video and one Henri Cartier-Bresson interview. Free. Better than half the courses you'll pay for. Join two photo walks.`),
    numbered(strong(`Week 5-6 `), `— Sign up for a weekend workshop. Pune-based, instructor with a real portfolio, 2-3 days max.`),
    numbered(strong(`Week 7-12 `), `— Shoot daily. Phone is fine. Rent a real camera for one weekend (we can help). See if your photos get sharper.`),
    numbered(strong(`Month 4 onwards `), `— If you're still shooting and still excited, sign up for FTII's short course or a niche workshop in your favourite genre.`),
    numbered(
      strong(`Month 6 `),
      `— Build a portfolio. Not a "best of" album. A `, em('project'),
      `. One subject, shot fifty times, in fifty different ways. That's what gets you taken seriously.`,
    ),

    h2(`Common mistakes Pune beginners make`),

    bullet(strong(`Buying gear before knowing genre. `), `You bought a 70-200mm because it was on sale. Now you're shooting street with a telephoto, hating life, and blaming the camera.`),
    bullet(strong(`Treating photography like an academic course. `), `Notes, theory, "syllabus completed" mindset. Photography rewards the kid who takes 10,000 frames, not the kid with the cleanest notebook.`),
    bullet(strong(`Comparing your phase-1 work to Instagram. `), `Those Instagram photos went through five edits, two presets, and a creator who's been shooting eight years. You've been shooting eight weeks. Stop.`),
    bullet(strong(`Quitting after the first 100 bad photos. `), `Everyone's first 100 are bad. Everyone's first 1,000 are mostly bad. The 1,001st is when something starts to click.`),
    bullet(strong(`Not joining a community. `), `Solo photographers burn out. Photographers in a WhatsApp group keep shooting for years.`),

    h2(`The thing nobody tells you`),

    image(img.street, 'A young photographer crouching to capture a shot in an Indian urban setting'),

    p(`Photography is the only skill where the gear you can't afford makes you feel like you're not allowed to learn. Don't fall for it.`),
    p(`The best teacher in Pune isn't a person. It's the city.`),
    p(`Sinhagad at 5 AM. The 7 AM light hitting the dome of Shaniwar Wada. Tulshi Baug on a Sunday. The Mula-Mutha at golden hour (yes, it has one). Camp at midnight when nobody's there. The pav-bhaji guy at FC Road who's been making the same pav-bhaji for thirty years and who'd let you photograph him if you'd just ask.`),
    p(`Pick a course if it forces you to show up. Pick a community if it keeps you showing up. But the actual lessons? Those are out there, in the city, every morning before the traffic starts.`),
    p(`Show up with whatever camera you can find.`),
    p(`The course will start by itself.`),
  ]
}
