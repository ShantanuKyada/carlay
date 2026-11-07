# Carlay — website & team dashboard (pitch prototype)

An interactive demo of a customer website and an internal management dashboard for **Carlay, Pune**.
All listings, customers and requests are **sample data** stored in the browser. Nothing is sent anywhere.

## Run it

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The team dashboard is at http://localhost:5173/admin.

Production build: `npm run build`, then `npm run preview`.

Photos: the licensed demo photos are already bundled in `public/demo/`. If any are missing, run `npm run fetch-images` (downloads from Wikimedia Commons). Without them, the app falls back to the online Commons thumbnail, then to a neutral panel.

## Demo script (about 5 minutes)

1. **Home**: hero, search, featured cars, how it works.
2. **Browse cars**: filter (for example Diesel, or under ₹15 Lakh), sort, switch between grid and list views. Sold and reserved cars are labelled.
3. **Vehicle page** (for example Škoda Slavia): gallery, specs, condition, then **Send an enquiry**, then **Book a test drive**.
4. **Sell your car**: the 5-step wizard with photo previews, ending with a reference number.
5. Click **See it in the team dashboard** (or open `/admin`). The new enquiry, test drive and sell request appear in the Overview, Enquiries, Test Drives and Sell Requests sections.
6. In **Enquiries**: change status, assign a team member, set a follow-up and add a note.
7. In **Inventory**: add a vehicle, edit its price, mark a car sold. The public site updates immediately.
8. Use **Reset demo data** to restore the starting state before the next pitch.

## Where to change things

| What | File |
|---|---|
| Contact number (WhatsApp), email, address, Instagram | `src/config.ts` |
| Sample vehicles | `src/data/vehicles.ts` |
| Sample enquiries, test drives, requests, team names | `src/data/seed.ts` |
| Colours, fonts | `src/index.css` |
| Image licences / credits | `src/data/imageCredits.ts` (shown under each car's photos) |

Stack: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Lucide icons, self-hosted fonts (Inter, Inter Tight, Michroma). State lives in React context and is persisted to `localStorage`.
