# Project notes

Static site for kevinbroadie.com (KBCS), no build step: `index.html`, `audit.html`, `accessibility.html`, `services.html`, `work.html`, `about.html`, `contact.html`, plus `404.html`, `offline.html`, `styles.css`, `script.js`, `sw.js` (offline support) and `manifest.webmanifest`. Each page has its own copy of the shared parts (header, footer with the theme switch, phone tab bar, and "More" sheet); keep them identical across pages, and when adding a page update the README upload list and the `PRECACHE` list in `sw.js`. Bump `VERSION` in `sw.js` with every change to the site's files. See README.md for previewing, GitHub Pages, and the files uploaded to the live web host.

## Positioning

- KBCS is a principal-led practice: Kevin leads every engagement and brings in the best person for each part of the job, whether that's him or a specialist he trusts. Clients keep one point of contact.
- Voice: "I" for Kevin's personal commitments (taking on engagements, reply time, leading audits, the About and contact pages); "we" for the work itself, which may involve specialists. Never imply a standing staff.
- Run as a lifestyle business for now; KBCS stays the brand, with Kevin named prominently.
- Market: Southern California, where all of Kevin's track record is. Say so in copy ("based in Palm Springs, working across Southern California") without implying offices elsewhere.
- Target clients: organizations with large budgets and large gaps in Kevin's areas (no in-house design or technology team), first; agencies hiring a white-label partner, second.

## Content

- Case notes (selected work): CVAG's ACCESS Indian Canyon Drive grant ($50M from the California Transportation Commission's LTCAP, approved unanimously, one of two projects with the state's highest priority ranking; Kevin co-facilitated the grant writing as CVAG's in-house designer; project info at cvag.org/access), Arroyos at Desert Princess (visual system), and the retail operations overhaul that integrated e-commerce (name withheld until Kevin says it can be shared). Don't use the museum IT systems upgrade as an example.
- Don't mention Konsist anywhere on the site except Kevin's bio on the About page, and don't link to konsist.co. The site isn't a résumé: organize work by industry and discipline, not by employer.
- Konsist (background only, konsist.co, 2016–2021): Kevin led the case studies for The Art Collective, Phillip K. Smith III, Grounded, Virgin River Naturals, and Mangus Group. He did not lead Palm Springs Art Museum, Café Mado, or The Venue Social Hour; Artful Events (a Palm Springs Art Museum program) is treated as part of the museum work unless he says otherwise. Kevin also led or worked closely on branding and marketing design, print production, digital strategy, and internal systems for: Priority Lighting, Elizabeth & Prince, Babe's Barbecue, Sandfish, The Venue (not the Social Hour campaign), Workshop, Truss & Twine, Wilma & Frieda, Ice Cream & Shoppe, The Draughtsman, Persimmon at the Palm Springs Art Museum, Bootlegger Tiki, Ernest Coffee, Tailor Shop, Grounded, Virgin River Naturals (candles), and Arrive Hotel Palm Springs. The Work page lists these projects and clients by industry, without naming Konsist.
- Kevin's ads and campaigns have been published in Palm Springs Life and Locale magazine, at Palm Springs International Airport, and on Lamar billboards (shown as a "Where the work has run" logo strip on the home and Work pages).
- NDAs are optional: offer one whenever a client wants it, never present it as standard or required.
- Confidentiality is offered when asked, not the default: name clients and organizations wherever permitted; anonymize only work under NDA or where the client asks.
- Kevin is a strong copyeditor (newsroom background, AP Stylebook); copyediting is part of the offer.
- Custom apps are part of the offer. Kevin designed and built a custom pairwise survey app used in a transportation project prioritization study (client not named; ask Kevin before adding details). The Services page demo uses made-up options and says so.
- Services go well beyond websites: audits of print and pre-production and of systems and service (taking the roles of customer and employee to find pain points for ease, speed, and clarity), staff training, writing and designing public presentations, and acting as a sounding board.
- Never invent results, quotes, or testimonials. Ask Kevin for specifics.
- Technical advice on the site (including sample audit findings) must hold up to Kevin's standards: check numbers (contrast ratios round down, as WCAG does) and never imply that a heavy file is acceptable on any screen.

## Attribution

Do not add AI attribution anywhere in this repository or on GitHub:

- No `Co-Authored-By` or session-link trailers in commit messages.
- No "Generated with Claude Code" (or similar) lines or footers in pull request descriptions, comments, or reviews.

## Contact details

- Email: kbroadie+kbcs@gmail.com (`CONTACT_EMAIL` in `script.js`, the footer, the "More" sheet, the contact page, and the home page's JSON-LD).
- Phone: 760-409-6303, written in AP style (hyphens, no parentheses); links use `tel:+17604096303`.
