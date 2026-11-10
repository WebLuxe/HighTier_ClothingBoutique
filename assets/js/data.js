/* =============================================================================
   WebLuxe High Fashion Boutique: shop data. Edit products, looks and contact details here.
   Photos are Unsplash photo IDs, the same photos as the main-branch site.
   To use your own photos, put them in assets/img/ and change HS.IMG to
   return 'assets/img/' + id.
   ============================================================================= */
window.HS = window.HS || {};

HS.DEMO = true;   // false for a real client: WhatsApp and Call links work for real

HS.SHOP = {
    name: 'WebLuxe',
    full: 'WebLuxe High Fashion Boutique',
    whatsapp: ''   // the shop's WhatsApp number with country code, e.g. 230 then the number
};

HS.IMG = (id, w = 800, h) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}&crop=top` : ''}&q=78`;

/* Filters on the shop page (the key is a product's category) */
HS.FILTERS = [
    ['all', 'All'],
    ['saree', 'Sarees'],
    ['bridal', 'Bridal lehengas'],
    ['lehenga', 'Party lehengas'],
    ['gown', 'Gowns & anarkalis'],
    ['groom', 'Groom sherwanis'],
    ['men', "Men's kurtas"]
];
HS.FABRIC = {
    saree: 'Saree', bridal: 'Bridal lehenga', lehenga: 'Party lehenga', gown: 'Gown & anarkali', groom: 'Groom sherwani', men: "Men's kurta"
};

/* id, name, kind (saree | outfit), category, occasion, price (Rs), photo, second photo, tag, description */
HS.PRODUCTS = [
    ["red-banarasi-silk-saree", "Purple & Gold Banarasi Silk Saree", 'saree', 'saree', '', 4500, '1610030469983-98e550d6193c', '1610030469668-8e9f641aaf27', "Bestseller",
        "Deep purple silk from the looms of Varanasi with a wide woven gold zari border."],
    ["emerald-silk-saree", "Sage Green Silk Saree", 'saree', 'saree', '', 3900, '1679006831648-7c9ea12e5807', '1727430228383-aa1fb59db8bf', "",
        "Soft sage green silk with a woven pattern, worn with a temple necklace."],
    ["purple-gold-kanjeevaram-saree", "Purple & Gold Kanjeevaram Saree", 'saree', 'saree', '', 6500, '1641699862936-be9f49b1c38d', '1610030469983-98e550d6193c', "New",
        "Heavy silk from Kanchipuram in royal purple with a rich gold border and pallu."],
    ["coral-silk-saree", "Coral Silk Saree", 'saree', 'saree', '', 2900, '1617627143750-d86bc21e42bb', '1769275061202-cf3ef67d7279', "",
        "Soft coral silk with a gold border. Light to wear and easy to drape."],
    ["printed-georgette-saree", "Printed Georgette Saree", 'saree', 'saree', '', 1900, '1769275061202-cf3ef67d7279', '1617627143750-d86bc21e42bb', "",
        "An easy printed georgette for office, temple and family lunches."],
    ["wedding-guest-saree", "Wedding Guest Saree", 'saree', 'saree', '', 3500, '1727430228383-aa1fb59db8bf', '1679006831648-7c9ea12e5807', "",
        "A rich festive saree that looks right at every wedding you are invited to this season."],
    ["red-floral-saree", "Red Floral Saree", 'saree', 'saree', '', 2500, '1610047520958-b42ebcd2f6cb', '1610030469668-8e9f641aaf27', "",
        "Red florals on a flowing drape, light enough for the summer wedding season."],
    ["scarlet-party-saree", "Black & Silver Banarasi Saree", 'saree', 'saree', '', 3200, '1610030469668-8e9f641aaf27', '1610047520958-b42ebcd2f6cb', "",
        "Black silk woven with silver zari, with a velvet blouse. Made for evening receptions."],
    ["emerald-ruffle-saree", "Emerald Ruffle Saree", 'saree', 'saree', '', 4600, "1756483492198-8ca91227489b", "", "New",
        "Bottle green georgette with ruffles down the pleats and a heavily embroidered blouse."],
    ["ivory-ruffle-saree", "Ivory Ruffle Saree", 'saree', 'saree', '', 4200, "1756483510889-dd6c3d9e0a17", "", "New",
        "Ivory and sand georgette with cascading ruffles that move with every step."],
    ["red-embellished-saree", "Red Embellished Saree", 'saree', 'saree', '', 5800, "1756483496916-5ebab85028df", "", "New",
        "Deep red with a gold border and an open-back embroidered blouse."],
    ["ivory-embroidered-saree", "Ivory Embroidered Saree", 'saree', 'saree', '', 5600, "1787753650891-c6e2625071df", "", "New",
        "Cream with tonal embroidery all over, worn with a red silk blouse."],
    ["lilac-floral-saree", "Purple Floral Saree", 'saree', 'saree', '', 2700, "1610189026297-df356264479c", "", "",
        "Purple with large lilac florals and a contrast blue blouse."],
    ["white-sunflower-saree", "White Embroidered Saree", 'saree', 'saree', '', 3900, "1710972200161-ada775a26401", "", "",
        "White with fine embroidery across the drape, worn with a black blouse."],
    ["olive-purple-silk-saree", "Olive & Purple Silk Saree", 'saree', 'saree', '', 3600, "1612273882937-44c5313400e5", "", "",
        "Olive silk with a purple border and pallu."],
    ["moonlight-white-saree", "Moonlight White Saree", 'saree', 'saree', '', 3400, "1670955108982-921a94cbe35f", "", "",
        "Pure white with a navy striped blouse. Simple and striking."],
    ["marigold-silk-saree", "Marigold Silk Saree", 'saree', 'saree', '', 4800, "1597897545000-7c99a285f27e", "", "",
        "Marigold silk with a red and gold border, the colour of festival mornings."],
    ["red-gold-silk-saree", "Red & Gold Silk Saree", 'saree', 'saree', '', 4400, "1732850195162-32afc5726455", "", "",
        "Red silk with a wide gold border and pallu."],
    ["bengal-white-red-saree", "White & Red Bengal Saree", 'saree', 'saree', '', 2200, "1756887957725-2111152d4e4f", "", "",
        "The classic white saree with a red border, worn for Durga Puja and every celebration after."],
    ["crimson-zari-bridal-lehenga", "Crimson Zari Bridal Lehenga", 'outfit', 'bridal', 'bridal', 18500, '1721324807083-e9ddaa99310e', '1654764746225-e63f5e90facd', "Bestseller",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["royal-red-bridal-lehenga", "Royal Red Bridal Lehenga", 'outfit', 'bridal', 'bridal', 21900, '1610047614301-13c63f00c032', '1610047614256-023d7c028d0b', "New",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["wine-velvet-bridal-lehenga", "Wine Velvet Bridal Lehenga", 'outfit', 'bridal', 'bridal', 24500, '1740674570259-a47d713a2976', '1677691257363-eebd2abeafec', "",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["red-gold-bridal-set", "Red & Gold Bridal Set", 'outfit', 'bridal', 'bridal', 16900, '1677691257363-eebd2abeafec', '1707576618343-26a1b377ca7a', "",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["rose-bridal-lehenga", "Rose Bridal Lehenga", 'outfit', 'bridal', 'bridal', 19500, '1629118477133-b8b1499f2b8a', '1662714802102-9825504458ca', "",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["maroon-embroidered-bridal-lehenga", "Maroon Embroidered Bridal Lehenga", 'outfit', 'bridal', 'bridal', 14900, '1707576618343-26a1b377ca7a', '1737514996816-a034a795febe', "",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["ivory-red-bridal-lehenga", "Ivory & Red Bridal Lehenga", 'outfit', 'bridal', 'bridal', 22500, '1737514996816-a034a795febe', '1610047614301-13c63f00c032', "New",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["heritage-red-bridal-lehenga", "Heritage Red Bridal Lehenga", 'outfit', 'bridal', 'bridal', 12900, '1662714802102-9825504458ca', '1721324807083-e9ddaa99310e', "",
        "A bridal lehenga made for the wedding day: heavy work, a full flare and a matching dupatta."],
    ["pink-mirror-work-lehenga", "Pink Mirror-Work Lehenga", 'outfit', 'lehenga', '', 5900, '1733937140732-2cc70a1d7017', '1746372283841-dbb3838f9935', "New",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["maroon-sequin-lehenga", "Maroon Sequin Lehenga", 'outfit', 'lehenga', '', 6500, '1756483488645-5973a1a92e33', '1610047614222-d33c39abfab2', "Bestseller",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["lavender-floral-lehenga", "Lavender Floral Lehenga", 'outfit', 'lehenga', '', 4500, '1617039487629-6babdcb2a24b', '1733937140732-2cc70a1d7017', "",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["mustard-bandhani-lehenga", "Mustard Bandhani Lehenga", 'outfit', 'lehenga', '', 3900, '1746372283841-dbb3838f9935', '1668371459824-094a960a227d', "",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["red-festive-lehenga", "Red Festive Lehenga", 'outfit', 'lehenga', '', 4900, '1610047614222-d33c39abfab2', '1756483488645-5973a1a92e33', "",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["rust-silk-lehenga", "Rust Silk Lehenga", 'outfit', 'lehenga', '', 3500, '1668371459824-094a960a227d', '1617039487629-6babdcb2a24b', "",
        "A festive lehenga for sangeet, mehendi and wedding-guest days, with a matching dupatta."],
    ["black-gold-anarkali", "Black & Gold Anarkali", 'outfit', 'gown', '', 4900, '1761571260010-8aa90a08c934', '1610202305255-746aa5b971c4', "New",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["red-embroidered-anarkali", "Red Embroidered Anarkali", 'outfit', 'gown', '', 4200, '1610202305255-746aa5b971c4', '1638457130899-121a2dc59513', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["blush-pink-anarkali-gown", "Blush Pink Anarkali Gown", 'outfit', 'gown', '', 3800, '1669195987863-f935f728e41b', '1649139798873-683a18de1151', "Bestseller",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["powder-blue-gown", "Powder Blue Gown", 'outfit', 'gown', '', 3500, '1616583936499-d4116e7e2e76', '1678536517273-f1ec164966ea', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["ivory-flared-gown", "Ivory Flared Gown", 'outfit', 'gown', '', 4500, '1678536517273-f1ec164966ea', '1744833341427-6f2b4eac91ff', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["sage-embellished-gown", "Sage Embellished Gown", 'outfit', 'gown', '', 5200, '1744833341427-6f2b4eac91ff', '1756483509254-3cc48a5a15b2', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["pink-festive-suit", "Pink Festive Suit", 'outfit', 'gown', '', 2800, '1649139798873-683a18de1151', '1669195987863-f935f728e41b', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["red-party-anarkali", "Red Party Anarkali", 'outfit', 'gown', '', 3900, '1638457130899-121a2dc59513', '1610202305255-746aa5b971c4', "",
        "A floor-length piece with an easy fit, made for receptions and family celebrations."],
    ["ivory-embroidered-groom-sherwani", "Ivory Embroidered Groom Sherwani", 'outfit', 'groom', 'bridal', 12900, '1760080838961-4208536db385', '1678805408312-04e5fd7a9dcc', "Groom",
        "A groom sherwani cut to sit sharp all day, ready to pair with a stole and mojaris."],
    ["royal-maroon-sherwani-set", "Royal Maroon Sherwani Set", 'outfit', 'groom', 'bridal', 14500, '1576470189712-50fe3ec06b04', '1759906766080-82b785c61f51', "Bestseller",
        "A groom sherwani cut to sit sharp all day, ready to pair with a stole and mojaris."],
    ["complete-groom-sherwani-with-safa", "Complete Groom Sherwani with Safa", 'outfit', 'groom', 'bridal', 15900, '1759906766080-82b785c61f51', '1760080838961-4208536db385', "",
        "A groom sherwani cut to sit sharp all day, ready to pair with a stole and mojaris."],
    ["navy-sherwani", "Navy Sherwani", 'outfit', 'groom', 'bridal', 9900, '1534217466718-ef4950786e24', '1729347917808-e3e35a462fec', "",
        "A groom sherwani cut to sit sharp all day, ready to pair with a stole and mojaris."],
    ["white-floral-sherwani", "White Floral Sherwani", 'outfit', 'groom', 'bridal', 8500, '1678805408312-04e5fd7a9dcc', '1534217466718-ef4950786e24', "",
        "A groom sherwani cut to sit sharp all day, ready to pair with a stole and mojaris."],
    ["green-embroidered-kurta-set", "Green Embroidered Kurta Set", 'outfit', 'men', '', 2500, '1727835523545-70ee992b5763', '1727835523550-18478cacefa2', "",
        "Men's festive wear for weddings, pujas and every family function."],
    ["yellow-festive-kurta", "Yellow Festive Kurta", 'outfit', 'men', '', 1900, '1768807478320-fcfd3929acb2', '1768807478287-9e7953cfdca3', "New",
        "Men's festive wear for weddings, pujas and every family function."],
    ["blue-kurta-with-jacket", "Blue Kurta with Jacket", 'outfit', 'men', '', 3500, '1767775498862-d4740ce574ce', '1768807478320-fcfd3929acb2', "Bestseller",
        "Men's festive wear for weddings, pujas and every family function."],
    ["black-kurta-pyjama", "Black Kurta Pyjama", 'outfit', 'men', '', 2200, '1711044871601-301f9b0ecf91', '1744551358303-46edae8b374b', "",
        "Men's festive wear for weddings, pujas and every family function."],
    ["ivory-indo-western-set", "Ivory Indo-Western Set", 'outfit', 'men', '', 6500, '1729347917808-e3e35a462fec', '1727835523550-18478cacefa2', "",
        "Men's festive wear for weddings, pujas and every family function."]
].map(r => ({
    id: r[0], name: r[1], kind: r[2], fabric: r[3], occasion: r[4], price: r[5], img: r[6], img2: r[7], tag: r[8], text: r[9]
}));

/* The six runway looks, in order. pos is the focal point of the photo; pieces are the two items shown in the rail. */
HS.LOOKS = [
    { name: 'Rajsi', title: 'Purple Banarasi', img: '1610030469983-98e550d6193c', pos: '50% 18%', pieces: ['red-banarasi-silk-saree', 'purple-gold-kanjeevaram-saree'],
      story: 'Deep purple silk from Varanasi with a wide gold zari border. The saree of weddings, worn the classic way.' },
    { name: 'Panna', title: 'Emerald Ruffle', img: '1756483492198-8ca91227489b', pos: '50% 18%', pieces: ['emerald-ruffle-saree', 'emerald-silk-saree'],
      story: 'Bottle green with ruffles down the pleats and an embroidered blouse. Modern, but still six yards.' },
    { name: 'Chandni', title: 'Ivory Ruffle', img: '1756483510889-dd6c3d9e0a17', pos: '50% 18%', pieces: ['ivory-ruffle-saree', 'moonlight-white-saree'],
      story: 'Moonlight in georgette. The ruffles fall from the pallu and the whole drape moves like water.' },
    { name: 'Raat', title: 'Black & Silver', img: '1610030469668-8e9f641aaf27', pos: '50% 18%', pieces: ['scarlet-party-saree', 'lilac-floral-saree'],
      story: 'Black silk woven with silver zari and a velvet blouse, for receptions that run late into the night.' },
    { name: 'Rani', title: 'Red Embellished', img: '1756483496916-5ebab85028df', pos: '50% 18%', pieces: ['red-embellished-saree', 'red-gold-silk-saree'],
      story: 'Deep red with a gold border and an open-back blouse. A saree that looks as good walking away.' },
    { name: 'Kora', title: 'Ivory Embroidered', img: '1787753650891-c6e2625071df', pos: '50% 18%', pieces: ['ivory-embroidered-saree', 'white-sunflower-saree'],
      story: 'Cream embroidery and a red silk blouse. Simple pieces that make a strong look together.' }
];

/* Categories for the home page tiles (photos from the main-branch site) */
HS.CATS = [
    ['saree', 'Sarees', '1641699862936-be9f49b1c38d'],
    ['bridal', 'Bridal lehengas', '1654764746225-e63f5e90facd'],
    ['lehenga', 'Party lehengas', '1733937140732-2cc70a1d7017'],
    ['gown', 'Anarkalis', '1761571260010-8aa90a08c934'],
    ['groom', 'Sherwanis', '1760080838961-4208536db385'],
    ['men', 'Kurtas', '1767775498862-d4740ce574ce']
];

/* Cut-outs: photos with the background removed (made by tools/cutouts, listed in
   assets/js/cut.js). HS.pic shows the cut-out when there is one, else the photo. */
HS.CUT = HS.CUT || {};
/* Each cut-out comes in four sizes (made by tools/sizes.py): s 480 tall, m 900 tall,
   full size about 1500 tall, and b, small and blurred, for models far back on the runway.
   HS.cutAttrs gives src + srcset + sizes so the browser picks the smallest that looks sharp. */
HS.cut = (id, size) => HS.CUT[id] ? `assets/img/cut/${size ? size + '/' : ''}${id}.webp` : '';
// box = height / width of the frame the cut-out sits in (cards are 3:4). A tall, slim cut-out
// only fills part of its frame's width, so the size hint is scaled down to match.
HS.cutAttrs = (id, sizes = '25vw', box = 4 / 3) => {
    const c = HS.CUT[id];
    if (!c) return '';
    const w = h => Math.round(c.w * Math.min(h, c.h) / c.h);
    const f = Math.min(1, box * c.w / c.h);
    const sz = sizes.replace(/([\d.]+)vw/g, (m, n) => (n * f).toFixed(1) + 'vw');
    const set = [...new Map([[w(480), 's'], [w(900), 'm'], [c.w, '']]).entries()].map(([px, k]) => `${HS.cut(id, k)} ${px}w`).join(', ');
    return `src="${HS.cut(id, 'm')}" srcset="${set}" sizes="${sz}"`;
};
HS.pic = (id, w, h, alt = '', lazy = true, sizes, box) => HS.CUT[id]
    ? `<img class="cutimg" ${HS.cutAttrs(id, sizes, box)} alt="${alt}"${lazy ? ' loading="lazy"' : ''} decoding="async">`
    : `<img src="${HS.IMG(id, w, h)}" alt="${alt}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
