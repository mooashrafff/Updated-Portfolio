export const personal = {
  // Basic identity
  name: 'Mohamed Ashraf El Sawy',
  age: '23',
  location: 'Cairo, Egypt',
  tagline: 'Business Information Systems Graduate • Event & Tech Innovator',
  bio:
    'Motivated BIS graduate with a strong mix of technical expertise, event management, and marketing experience. Skilled in software development, AI-driven solutions, and large-scale event coordination, I strive to bridge business and technology to create impactful solutions across industries.',
  tags: ['Full-Stack Development','Event Management','AI Projects','Real Estate Marketing','Business Intelligence'],

  // Images / avatars
  avatar: {
    profileSrc: '/bg avatar.png',
    squareAvatarSrc: '/avatar.png',
    fallbackSrc: '/bg avatar.png',
  },

  // Branding and SEO
  branding: {
    siteTitle: 'AI Portofolio',
    siteDescription:
      'Business Information Systems Graduate • Developer • Event Organizer',
    keywords: [
      'Portfolio',
      'Developer',
      'AI',
      'Interactive',
      'Web Development',
      'Full Stack',
      'Next.js',
      'React',
    ],
    siteUrl: 'https://mohamedashraf.com',
    creatorName: 'Mohamed Ashraf El Sawy',
    twitterHandle: '@mooashrafff',
    wordmarkText: 'MA',
    logoSrc: '/logo.svg',
  },

  // Socials & contact
  contact: {
    email: 'mohamedashrafalsawyy@gmail.com',
    handle: '@mooashrafff',
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohamed-ashraf-77b89b24b/' },
      { name: 'GitHub', url: 'https://github.com/mooashrafff' },
      { name: 'X', url: 'https://x.com/mooashrraff' },
    ],
  },

  // Resume block
  resume: {
    title: "Mohamed Ashraf's Resume",
    description: 'Business Information Systems Graduate • Full-Stack & Event Innovator',
    fileType: 'PDF',
    lastUpdated: 'August 2025',
    fileSize: '1.2 MB',
    previewImageSrc: '/resume-preview.png',
    downloadUrl: '/mohamed_final_cv.pdf',
  },

  // Presentation for chat tool
  presentation:
    "I'm Mohamed Ashraf El Sawy, a BIS graduate and event & tech innovator. I bridge business and technology through full‑stack development and AI-driven solutions.",

  // GitHub / X links used in UI and API
  github: {
    repoUrl: 'https://github.com/mooashrafff',
    apiRepoUrl: 'https://api.github.com/repos/mooashrafff',
  },
  x: {
    profileUrl: 'https://www.linkedin.com/in/mohamed-ashraf-77b89b24b/',
    handle: 'LinkedIn',
  },

  // Internship card + tool
  internship: {
    contactEmail: 'mohamedashrafalsawyy@gmail.com',
    duration: '6 months',
    startDate: 'September 2025',
    locationPreference: 'Cairo or Remote',
    focus:
      'AI-integrated business systems',
    stack:
      'JavaScript, React.js, Node.js, SQL, PHP, Odoo, Oracle, Python',
    visa: 'Eligible to work in Egypt',
    whatIBring:
      'I bring a blend of technical development, event leadership, and creative problem-solving with proven results across banking, real estate, and large-scale events.',
    contactLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohamed-ashraf-77b89b24b/' },
    ],
  },

  // Chat fun facts / customizations
  chat: {
    crazyDescription:
      'Directed 12+ large-scale campus events, organized international festivals like Gouna Film Festival, and even managed logistics for national sports events — all while completing my BIS degree.',
    crazyLink: 'https://www.linkedin.com/in/mohamed-ashraf-77b89b24b/',
  },
};

export type PersonalConfig = typeof personal;

