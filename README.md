# WebLuxe High Fashion Boutique: Signature demo

The top tier of the WebLuxe clothing-shop demos. It's a static site with no build step and works on GitHub Pages as it is.

## Second Signature design
`royal/` holds Signature Royal, the maroon and gold one-page boutique (mandala opening curtain, silk-pleat transitions, gold dust, owner panel at `royal/admin/`). Live: https://webluxe.github.io/HighTier_ClothingBoutique/royal/

## Pages
| Page | What it is |
|---|---|
| `index.html` | Runway: six saree looks stand in a line into the distance. Drag, swipe, scroll sideways or use the arrows. It walks by itself until the visitor takes over. An opening curtain plays once per visit. |
| `lookbook.html` | Each look has its story, its pieces and an "Add the look" button. |
| `shop.html` | Every piece, with filters, search and sort (`shop.html?f=saree`, `shop.html?q=banarasi`). |
| `product.html?id=…` | Photos, blouse choice, quantity, add to bag, ask on WhatsApp. |
| `house.html`, `visit.html`, `bag.html`, `404.html` | Story, boutiques with booking form, bag with "Order on WhatsApp", not found. |

## Demo mode
- `?name=Shop+Name&accent=0f6b5c` on any link re-brands the demo for a prospect (kept for the visit).
- WhatsApp, Call and social links show a popup with the message the customer would send, instead of contacting anyone. Turn this off for a real client with `HS.DEMO = false` in `assets/js/data.js`.
- A "Demo · example pieces and prices" label links to the WebLuxe site.

## Effects (`assets/js/fx.js`, `assets/css/fx.css`)
Opening curtain; soft page changes where the tapped photo grows into the next page (in browsers that support it); gold sheen on headings; gold dust over the runway; light ray and lift on product cards; pieces fly into the bag.

## Photos
Products and looks are in `assets/js/data.js`. Cut-outs (background removed) live in `assets/img/cut/` and are listed in `assets/js/cut.js`.
After adding a cut-out, run `python tools/sizes.py` to make the smaller copies the site loads (`s/`, `m/`, and blurred `b/` for the runway). To cut out new photos on GitHub, copy `tools/cutouts/cutouts-workflow.yml` to `.github/workflows/` and list the Unsplash IDs in `tools/cutouts/photos.txt`.

All photos are Unsplash stock and all pieces, prices, names and addresses are examples.
Live: https://webluxe.github.io/HighTier_ClothingBoutique/ · Website built by [WebLuxe](https://webluxe.github.io/WebLuxe/).
