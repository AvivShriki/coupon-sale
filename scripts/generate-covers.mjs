// מייצר עטיפות SVG מקומיות לכל קטגוריה ראשית (3 וריאציות), כדי שלא תהיה תלות בשירות תמונות חיצוני.
import { mkdirSync, writeFileSync } from "node:fs";

const palette = {
  entertainment: 296,
  vacations: 196,
  attractions: 28,
  food: 8,
  spa: 168,
  digital: 264,
  education: 232,
  "special-events": 330,
  vouchers: 88,
  sports: 146,
  benefits: 48,
};

const W = 1200;
const H = 800;

function variant(hue, index) {
  const h2 = (hue + 24 + index * 10) % 360;
  const light = 58 - index * 4;
  const dark = 26 + index * 3;
  const shapes = [
    // קווי אור אלכסוניים
    `<g opacity="0.14" fill="none" stroke="#fff" stroke-width="2">
       ${Array.from({ length: 9 }, (_, i) => `<path d="M${-200 + i * 190} ${H + 60} L${120 + i * 190} -60"/>`).join("")}
     </g>`,
    // עיגולים קונצנטריים
    `<g opacity="0.16" fill="none" stroke="#fff" stroke-width="2">
       ${Array.from({ length: 7 }, (_, i) => `<circle cx="${W * 0.74}" cy="${H * 0.3}" r="${80 + i * 78}"/>`).join("")}
     </g>`,
    // גלים
    `<g opacity="0.15" fill="none" stroke="#fff" stroke-width="2.5">
       ${Array.from({ length: 6 }, (_, i) => `<path d="M-40 ${180 + i * 115} Q ${W * 0.3} ${90 + i * 115} ${W * 0.56} ${200 + i * 115} T ${W + 40} ${150 + i * 115}"/>`).join("")}
     </g>`,
  ][index % 3];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 68% ${light}%)"/>
      <stop offset="1" stop-color="hsl(${h2} 72% ${dark}%)"/>
    </linearGradient>
    <radialGradient id="h" cx="0.78" cy="0.18" r="0.75">
      <stop offset="0" stop-color="#fff" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${shapes}
  <rect width="${W}" height="${H}" fill="url(#h)"/>
</svg>`;
}

mkdirSync("public/covers", { recursive: true });
let count = 0;
for (const [slug, hue] of Object.entries(palette)) {
  for (let i = 0; i < 3; i++) {
    writeFileSync(`public/covers/${slug}-${i + 1}.svg`, variant(hue, i));
    count++;
  }
}
console.log(`נוצרו ${count} עטיפות`);
