# Photo booth gallery

Nine illustrative stock portraits, not photographs of Sundown Press customers or a record of actual booth sessions. Optimised 420px AVIF images are included in `public/images/photobooth/` and served locally. The Pexels image CDN supplied the originals. Update the portrait list in `src/photobooth.jsx` and corresponding local assets to change the collection.

Source: [Pexels License](https://www.pexels.com/license/).

| Photo | Source page |
| --- | --- |
| Smiling couple | https://www.pexels.com/photo/happy-indian-couple-looking-at-camera-4307635/ |
| Couple in traditional attire | https://www.pexels.com/photo/happy-couple-in-traditional-indian-attire-outdoors-30723691/ |
| Black and white couple portrait | https://www.pexels.com/photo/romantic-black-and-white-portrait-of-indian-couple-37572244/ |
| Smiling woman | https://www.pexels.com/photo/portrait-of-a-woman-smiling-26423890/ |
| Woman in a blue saree | https://www.pexels.com/photo/smiling-woman-in-traditional-dress-at-night-19119341/ |
| Black and white portrait | https://www.pexels.com/photo/portrait-of-indian-woman-in-black-and-white-16902222/ |
| Man with henna | https://www.pexels.com/photo/smiling-man-with-henna-tattoos-18107912/ |
| Man in a white shirt | https://www.pexels.com/photo/man-in-white-long-sleeve-shirt-smiling-9271168/ |
| Man in traditional attire | https://www.pexels.com/photo/smiling-indian-man-in-traditional-attire-outdoors-29153202/ |

The screen renders the original [Originkit Infinity Canvas](https://www.originkit.dev/components/infinitegallery?preset=base) installed with `npx originkit@latest add infinitegallery --custom-style`. Its source lives in `src/components/originkit/ui/infinitegallery-custom-style.tsx`. The original scattered layout and octave-based continuous zoom are preserved. Integration additions expose its camera to the booth's buttons and keyboard controls, add gentle automatic panning, and support pausing, offscreen visibility, and reduced motion. Tailwind utilities scan the component directory; the global Tailwind reset is omitted to preserve the rest of the site.
