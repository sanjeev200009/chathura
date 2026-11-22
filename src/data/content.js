// Page content that appears in more than one place, kept in one spot.

export const STATS = [
  { value: '5+ years', label: 'Hands-on digital design experience' },
  { value: '20+ projects', label: 'Digital experiences and creative solutions' },
  { value: '6 core services', label: 'From UI/UX to web design and branding' },
]

export const FAQ = [
  'What services do you offer?',
  'Do you work with international clients?',
  'What types of clients do you work with?',
  'How can we start working with you?',
  'What makes your approach different?',
  'How much do your services cost?',
]

export const PRINCIPLES = [
  { title: 'Digital-first mindset', text: 'Designing digital products, websites, and<br />experiences with purpose.' },
  { title: 'Creative &amp; visual design', text: 'Strong visuals that communicate ideas clearly<br />and memorably.' },
  { title: 'People-first experiences', text: 'Interfaces shaped around how real people think<br />and behave.' },
  { title: 'Concept to delivery', text: 'From early sketches to final files, every detail is<br />covered.' },
]

export const PROCESS = [
  { title: 'Discover', text: 'Understanding your goals, audience, and the problem worth solving.' },
  { title: 'Define', text: 'Turning insights into a clear direction, structure, and user flow.' },
  { title: 'Design', text: 'Crafting wireframes, interfaces, and visual identities with attention to every detail.' },
  { title: 'Deliver', text: 'Polished files, prototypes, and handoff so your product is ready to launch.' },
]

export const EVERY_PROJECT = [
  { title: 'Clear strategy', text: 'We start with your goals and audience so every design decision has a reason.' },
  { title: 'Pixel-perfect design', text: 'Consistent spacing, typography, and color applied with care across every screen.' },
  { title: 'Responsive by default', text: 'Layouts planned for desktop, tablet, and mobile from the very first draft.' },
  { title: 'Handoff &amp; support', text: 'Organized files, assets, and guidance so developers can build with confidence.' },
]

export const SKILLS = [
  { title: 'UI/UX Design', text: 'User flows, wireframes, and interactive prototypes designed in Figma around real user needs.' },
  { title: 'Web Design', text: 'Responsive websites and landing pages — from layout and structure to polished UI.' },
  { title: 'Graphic &amp; Brand Design', text: 'Logos, social creatives, and visual identities crafted in Illustrator and Photoshop.' },
  { title: 'Mobile &amp; SaaS Products', text: 'App interfaces and dashboards that make complex products feel simple and clear.' },
]

export const TOOLS = [
  { name: 'Figma', text: 'UI/UX design &amp; prototyping' },
  { name: 'Adobe Illustrator', text: 'Branding &amp; vector graphics' },
  { name: 'Adobe Photoshop', text: 'Visual design &amp; retouching' },
  { name: 'Canva', text: 'Fast, on-brand social creatives' },
]

// The six services. `icon` names a drawing in components/icons.js.
export const SERVICES = [
  { title: '01. UI/UX Design', icon: 'uiux', text: 'User flows, wireframes, interactive prototypes, and intuitive<br />interfaces designed around real user needs.' },
  { title: '02. Web Design', icon: 'web', text: 'Modern, responsive websites and landing pages that look<br />sharp and convert visitors into clients.' },
  { title: '03. Graphic Design', icon: 'graphic', text: 'Posters, social creatives, and visual assets that keep your<br />brand consistent and memorable.' },
  { title: '04. Mobile App Design', icon: 'uiux', text: 'Clean, thumb-friendly app interfaces for iOS and Android,<br />from first screen to final handoff.' },
  { title: '05. SaaS Design', icon: 'web', text: 'Dashboards and product UI that make complex tools feel<br />simple, clear, and easy to adopt.' },
  { title: '06. Brand Identity', icon: 'graphic', text: 'Logos, color, and type systems that give your brand a distinct<br />voice across every touchpoint.' },
]

// Home page services cards (their own shorter copy, as in the home design).
export const HOME_SERVICES = [
  { title: '01. UI/UX Design', icon: 'uiux', text: 'User flows, wireframes, interactive prototypes, and intuitive<br />interfaces designed around real user needs.' },
  { title: '02. Web Design', icon: 'web', text: 'We collaborate with client teams to ensure solutions<br />are practical and effective.' },
  { title: '03. Graphic Design', icon: 'graphic', text: 'We design strategies that adapt to change and support<br />sustainable growth.' },
]

// Projects shown on Selected Work. An empty `image` shows an "Add project image" placeholder.
export const PROJECTS = [
  {
    cat: 'web', label: 'WEBSITE DESIGN (UI/UX)', title: 'Car Rental Website Design', kind: 'Website Design (UI/UX)',
    text: 'A clean, conversion-focused website for a modern car rental service<br />— covering the booking flow, fleet showcase, and responsive<br />layouts.',
    image: '/work/car-rental-full.png', href: '/project-car-rental.html',
  },
  { cat: 'mobile', label: 'MOBILE APP DESIGN (UI/UX)', title: 'Mobile App Design', kind: 'Mobile App Design (UI/UX)', text: 'Project description goes here: the challenge, the approach, and the<br />result in two or three lines.', image: '', href: '#' },
  { cat: 'graphic', label: 'GRAPHIC DESIGN', title: 'Brand Identity Project', kind: 'Graphic Design', text: 'Project description goes here: the challenge, the approach, and the<br />result in two or three lines.', image: '', href: '#' },
  { cat: 'saas', label: 'SAAS DESIGN', title: 'SaaS Dashboard Design', kind: 'SaaS Design', text: 'Project description goes here: the challenge, the approach, and the<br />result in two or three lines.', image: '', href: '#' },
]
