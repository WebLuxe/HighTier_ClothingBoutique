/* =============================================================================
   WebLuxe High Fashion Boutique: behaviour shared by every page
   1. Helpers, bag and saved pieces (kept in this browser)
   2. Header, mobile menu, search, toast
   3. Product cards
   4. Pages: shop, product, lookbook, bag, visit
   ============================================================================= */
(() => {
    'use strict';
    const HS = window.HS;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const money = n => 'Rs ' + n.toLocaleString('en-US');
    const byId = id => HS.PRODUCTS.find(p => p.id === id);
    const wa = text => `https://wa.me/${HS.SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
    const store = {
        get(k, f) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? f; } catch (e) { return f; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
    };
    const PAGE = document.body.dataset.page;
    const BLOUSE = ['Unstitched blouse piece', 'Stitched to my measurements'];

    /* ------------------------------------------------------------------ 1. bag + saved */
    let bag = store.get('hs_bag', []).filter(i => i && byId(i.id));
    let saved = store.get('hs_saved', []).filter(byId);
    const count = () => bag.reduce((n, i) => n + i.qty, 0);

    function sync(bump) {
        store.set('hs_bag', bag);
        store.set('hs_saved', saved);
        $$('[data-cart]').forEach(e => {
            e.textContent = count();
            e.dataset.n = count();
            if (bump) { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
        });
        $$('[data-fav]').forEach(b => b.setAttribute('aria-pressed', saved.includes(b.dataset.fav)));
        window.dispatchEvent(new CustomEvent('hs:change'));
    }
    function addToBag(id, qty = 1, blouse) {
        const p = byId(id);
        if (!p) return;
        const b = p.kind === 'saree' ? (blouse || BLOUSE[0]) : '';
        const line = bag.find(i => i.id === id && i.blouse === b);
        if (line) line.qty = Math.min(9, line.qty + qty); else bag.push({ id, qty, blouse: b });
        sync(true);
        toast(`${p.name} is in your bag`, 'bag.html', 'View bag');
    }
    function toggleSaved(id) {
        const p = byId(id);
        if (!p) return;
        const on = saved.includes(id);
        saved = on ? saved.filter(x => x !== id) : [...saved, id];
        sync();
        toast(on ? 'Removed from saved' : `Saved ${p.name}`, on ? '' : 'bag.html#saved', on ? '' : 'See saved');
    }
    HS.addToBag = addToBag;
    HS.byId = byId;
    HS.money = money;
    HS.esc = esc;

    /* ------------------------------------------------------------------ 2. chrome */
    let toastTimer;
    function toast(msg, href, label) {
        const t = $('#toast');
        if (!t) return;
        t.innerHTML = `<span>${esc(msg)}</span>${href ? `<a href="${href}">${esc(label)}</a>` : ''}`;
        t.classList.add('on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('on'), 2800);
    }
    HS.toast = toast;

    const root = document.documentElement;
    const menuBtn = $('.menu-btn');
    function setMenu(open) {
        root.classList.toggle('menu-open', open);
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', open);
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }
        $('#drawer')?.setAttribute('aria-hidden', !open);
    }
    menuBtn?.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    matchMedia('(min-width:821px)').addEventListener?.('change', e => e.matches && setMenu(false));

    const search = $('#search');
    function setSearch(open) {
        if (!search) return;
        search.classList.toggle('on', open);
        search.setAttribute('aria-hidden', !open);
        if (open) { setMenu(false); setTimeout(() => $('input', search).focus(), 60); }
    }
    $$('.search-btn').forEach(b => b.addEventListener('click', () => setSearch(true)));
    search?.addEventListener('click', e => { if (e.target === search || e.target.closest('.x')) setSearch(false); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { setSearch(false); setMenu(false); }
        if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); setSearch(true); }
    });

    document.addEventListener('click', e => {
        const add = e.target.closest('[data-add]');
        if (add) {
            e.preventDefault();
            addToBag(add.dataset.add);
            add.classList.add('done');
            setTimeout(() => add.classList.remove('done'), 900);
            return;
        }
        const fav = e.target.closest('[data-fav]');
        if (fav) { e.preventDefault(); toggleSaved(fav.dataset.fav); }
    });

    const hdrAny = $('.hdr');
    const setH = () => hdrAny && root.style.setProperty('--hdr-h', hdrAny.offsetHeight + 'px');
    setH();
    addEventListener('resize', setH);
    const hdr = $('.hdr.stick');
    if (hdr) addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 4), { passive: true });

    $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

    $$('.news').forEach(f => f.addEventListener('submit', e => {
        e.preventDefault();
        const v = $('input', f).value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) { toast('Please enter your email'); return; }
        f.reset();
        toast('Thank you. You are on the list for new arrivals.');
    }));

    /* reveal on scroll */
    function reveal(scope = document) {
        const els = $$('.reveal:not(.in)', scope);
        if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
        const io = new IntersectionObserver(es => es.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        }), { rootMargin: '0px 0px -8% 0px' });
        els.forEach(e => io.observe(e));
    }
    HS.reveal = reveal;

    /* ------------------------------------------------------------------ 3. cards */
    const heart = '<svg viewBox="0 0 24 24"><path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z"/></svg>';
    HS.heart = heart;
    function card(p, eager) {
        const tag = p.tag ? `<span class="tag${/Bestseller|Groom/.test(p.tag) ? ' red' : ''}">${esc(p.tag)}</span>` : '';
        const load = eager ? 'eager' : 'lazy';
        return `<article class="pc reveal">
            <a class="ph${HS.CUT[p.img] ? ' cutbg' : ''}" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
                ${HS.CUT[p.img] ? `<img class="cutimg" ${HS.cutAttrs(p.img, '(max-width:820px) 50vw, 25vw')} alt="${esc(p.name)}" loading="${load}" decoding="async">`
                    : `<img src="${HS.IMG(p.img, 600, 800)}" srcset="${HS.IMG(p.img, 400, 533)} 400w, ${HS.IMG(p.img, 600, 800)} 600w, ${HS.IMG(p.img, 900, 1200)} 900w" sizes="(max-width:820px) 50vw, 25vw" alt="${esc(p.name)}" loading="${load}" decoding="async">
                ${p.img2 ? `<img class="b" src="${HS.IMG(p.img2, 600, 800)}" alt="" loading="lazy" decoding="async">` : ''}`}
                ${tag}
            </a>
            <button class="fav" data-fav="${p.id}" aria-pressed="${saved.includes(p.id)}" aria-label="Save ${esc(p.name)}">${heart}</button>
            <div class="meta">
                <small>${esc(HS.FABRIC[p.fabric] || '')}</small>
                <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
                <span>${money(p.price)}</span>
                <button class="add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to bag"></button>
            </div>
        </article>`;
    }
    HS.card = card;

    /* ------------------------------------------------------------------ 4. pages */
    const params = new URLSearchParams(location.search);

    /* ---------- shop */
    if (PAGE === 'shop') {
        const grid = $('#grid'), chips = $('#chips'), sortSel = $('#sort'), info = $('#count'), q = $('#q'), empty = $('#empty');
        let filter = params.get('f') || 'all';
        if (!HS.FILTERS.some(f => f[0] === filter)) filter = 'all';
        q.value = params.get('q') || '';
        chips.innerHTML = HS.FILTERS.map(([k, l]) => `<button class="chip" data-k="${k}" aria-pressed="${k === filter}">${l}</button>`).join('');

        const matches = (p, k) => k === 'all' || p.fabric === k || p.occasion === k || p.kind === k;
        function draw() {
            const term = q.value.trim().toLowerCase();
            let list = HS.PRODUCTS.filter(p => matches(p, filter));
            if (term) list = list.filter(p => (p.name + ' ' + (HS.FABRIC[p.fabric] || '') + ' ' + p.occasion + ' ' + p.text).toLowerCase().includes(term));
            const s = sortSel.value;
            if (s === 'low') list = [...list].sort((a, b) => a.price - b.price);
            if (s === 'high') list = [...list].sort((a, b) => b.price - a.price);
            grid.innerHTML = list.map((p, i) => card(p, i < 4)).join('');
            info.textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
            empty.hidden = list.length > 0;
            reveal(grid);
            const u = new URL(location.href);
            filter === 'all' ? u.searchParams.delete('f') : u.searchParams.set('f', filter);
            term ? u.searchParams.set('q', term) : u.searchParams.delete('q');
            history.replaceState(null, '', u);
            const label = HS.FILTERS.find(f => f[0] === filter)[1];
            $('#title').textContent = filter === 'all' ? 'The saree edit' : label;
            $$('.r2 a, .drawer .small a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `shop.html?f=${filter}`));
        }
        chips.addEventListener('click', e => {
            const c = e.target.closest('.chip');
            if (!c) return;
            filter = c.dataset.k;
            $$('.chip', chips).forEach(x => x.setAttribute('aria-pressed', x === c));
            c.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            draw();
        });
        sortSel.addEventListener('change', draw);
        let t;
        q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 160); });
        $('#reset').addEventListener('click', () => { q.value = ''; filter = 'all'; $$('.chip', chips).forEach(x => x.setAttribute('aria-pressed', x.dataset.k === 'all')); draw(); });
        draw();
    }

    /* ---------- product */
    if (PAGE === 'product') {
        const p = byId(params.get('id')) || HS.PRODUCTS[0];
        document.title = `${p.name} | ${HS.SHOP.name}`;
        const look = HS.LOOKS.findIndex(l => l.pieces.includes(p.id));
        const views = [
            { img: p.img, pos: '50% 30%', z: 1, label: 'Full drape' },
            p.img2 ? { img: p.img2, pos: '50% 30%', z: 1, label: 'Second view' } : { img: p.img, pos: '50% 22%', z: 1.7, label: 'Close up' },
            { img: p.img, pos: '50% 80%', z: 1.9, label: 'Detail' }
        ];
        if (HS.CUT[p.img]) views.unshift({ img: p.img, cut: true, pos: '50% 100%', z: 1, label: 'Cut-out' });
        $('#crumb').textContent = p.name;
        $('#pname').textContent = p.name;
        $('#pprice').textContent = money(p.price);
        $('#pfabric').textContent = HS.FABRIC[p.fabric];
        $('#ptext').textContent = p.text;
        const main = $('#main');
        const show = i => {
            const v = views[i];
            if (v.cut) { main.sizes = '(max-width:820px) 100vw, 50vw'; main.srcset = HS.cutAttrs(v.img).match(/srcset="([^"]+)/)[1]; } else main.removeAttribute('srcset');
            main.src = v.cut ? HS.cut(v.img, 'm') : HS.IMG(v.img, 1200, 1600);
            main.classList.toggle('cutimg', !!v.cut);
            main.parentElement.classList.toggle('cutbg', !!v.cut);
            main.alt = `${p.name}, ${v.label.toLowerCase()}`;
            main.style.objectPosition = v.pos;
            main.style.transform = `scale(${v.z})`;
            main.style.transformOrigin = v.pos;
            $$('#thumbs button').forEach((b, j) => b.setAttribute('aria-current', i === j));
        };
        $('#thumbs').innerHTML = views.map((v, i) => `<button aria-label="${v.label}"${v.cut ? ' class="cutbg"' : ''}><img${v.cut ? ' class="cutimg"' : ''} src="${v.cut ? HS.cut(v.img, 's') : HS.IMG(v.img, 240, 320)}" alt="" style="object-position:${v.pos};transform:scale(${v.z});transform-origin:${v.pos}" loading="lazy"></button>`).join('');
        $$('#thumbs button').forEach((b, i) => b.addEventListener('click', () => show(i)));
        show(0);
        let sx = null;
        main.parentElement.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
        main.parentElement.addEventListener('touchend', e => {
            if (sx == null) return;
            const dx = e.changedTouches[0].clientX - sx, cur = $$('#thumbs button').findIndex(b => b.getAttribute('aria-current') === 'true');
            if (Math.abs(dx) > 40) show((cur + (dx < 0 ? 1 : -1) + views.length) % views.length);
            sx = null;
        });

        const opts = $('#blouse');
        if (p.kind === 'saree') {
            opts.innerHTML = BLOUSE.map((b, i) => `<label class="opt"><input type="radio" name="blouse" value="${b}" ${i ? '' : 'checked'}><span>${b}</span></label>`).join('');
        } else {
            $('#blouseWrap').hidden = true;
            $('#dims').textContent = 'Sizes and fitting are confirmed with you in store or on WhatsApp. Each piece is checked in store before it is sent.';
            $('#drapeRow').hidden = true;
        }
        let qty = 1;
        const qEl = $('#qty');
        $('#minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qEl.textContent = qty; });
        $('#plus').addEventListener('click', () => { qty = Math.min(9, qty + 1); qEl.textContent = qty; });
        const addNow = () => addToBag(p.id, qty, ($('input[name=blouse]:checked') || {}).value);
        $('#addBtn').addEventListener('click', addNow);
        $('#barAdd').addEventListener('click', addNow);
        $('#barName').textContent = p.name;
        $('#barPrice').textContent = money(p.price);
        const favBtn = $('#pfav');
        favBtn.dataset.fav = p.id;
        favBtn.setAttribute('aria-pressed', saved.includes(p.id));
        $('#ask').href = wa(`Hello ${HS.SHOP.full}, I would like to ask about the ${p.name} (${money(p.price)}).`);
        if (look > -1) {
            $('#lookLink').href = `lookbook.html#look-${look + 1}`;
            $('#lookLink').textContent = `Worn in Look 0${look + 1}, ${HS.LOOKS[look].name}`;
        } else $('#lookLink').hidden = true;

        const pair = look > -1 ? HS.LOOKS[look].pieces.filter(id => id !== p.id).map(byId) : [];
        const more = HS.PRODUCTS.filter(x => x.id !== p.id && !pair.includes(x) && (x.fabric === p.fabric || x.occasion === p.occasion));
        const rel = [...pair, ...more, ...HS.PRODUCTS.filter(x => x.id !== p.id)].filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
        $('#related').innerHTML = rel.map(x => card(x)).join('');

        const bar = $('#bar'), addBtn = $('#addBtn');
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([en]) => bar.classList.toggle('on', !en.isIntersecting && en.boundingClientRect.top < 0)).observe(addBtn);
        }
        reveal();
    }

    /* ---------- lookbook */
    if (PAGE === 'lookbook') {
        const host = $('#looks');
        host.innerHTML = HS.LOOKS.map((l, i) => {
            const pieces = l.pieces.map(byId);
            const total = pieces.reduce((n, p) => n + p.price, 0);
            return `<section class="look-sec${i % 2 ? ' flip' : ''}" id="look-${i + 1}" aria-labelledby="lt${i}">
                <figure class="arch reveal${HS.CUT[l.img] ? ' cutbg' : ''}">${HS.CUT[l.img] ? `<img class="cutimg" ${HS.cutAttrs(l.img, '(max-width:820px) 92vw, 44vw')} alt="Look ${i + 1}: ${esc(l.title)} saree" loading="${i < 1 ? 'eager' : 'lazy'}">` : `<img src="${HS.IMG(l.img, 1100, 1500)}" srcset="${HS.IMG(l.img, 600, 820)} 600w, ${HS.IMG(l.img, 1100, 1500)} 1100w" sizes="(max-width:820px) 92vw, 44vw" alt="Look ${i + 1}: ${esc(l.title)} saree" loading="${i < 1 ? 'eager' : 'lazy'}" style="object-position:${l.pos}">`}</figure>
                <div class="look-copy reveal">
                    <p class="num wide">Look <span>0${i + 1}</span></p>
                    <h2 class="h1" id="lt${i}">${esc(l.name)}</h2>
                    <p class="eyebrow">${esc(l.title)}</p>
                    <p class="lede">${esc(l.story)}</p>
                    <ul class="pieces">${pieces.map(p => `<li>
                        <a href="product.html?id=${p.id}">${HS.CUT[p.img] ? `<img class="cutimg" src="${HS.cut(p.img, 's')}" alt="" loading="lazy">` : `<img src="${HS.IMG(p.img, 160, 200)}" alt="" loading="lazy">`}</a>
                        <div><a class="wide" href="product.html?id=${p.id}">${esc(p.name)}</a><span>${money(p.price)}</span></div>
                        <button class="fav" data-fav="${p.id}" aria-pressed="${saved.includes(p.id)}" aria-label="Save ${esc(p.name)}">${heart}</button>
                    </li>`).join('')}</ul>
                    <div class="look-cta"><button class="btn" data-look="${i}">Add the look · ${money(total)}</button><a class="link" href="product.html?id=${pieces[0].id}">See the saree</a></div>
                </div>
            </section>`;
        }).join('');
        host.addEventListener('click', e => {
            const b = e.target.closest('[data-look]');
            if (!b) return;
            HS.LOOKS[b.dataset.look].pieces.forEach(id => addToBag(id));
            toast(`Look 0${+b.dataset.look + 1} is in your bag`, 'bag.html', 'View bag');
        });
        const nav = $('#lookNav');
        nav.innerHTML = HS.LOOKS.map((l, i) => `<a href="#look-${i + 1}"><b>0${i + 1}</b><span>${esc(l.name)}</span></a>`).join('');
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(es => es.forEach(en => {
                if (!en.isIntersecting) return;
                $$('a', nav).forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
                const on = $('a.on', nav);
                if (on) nav.scrollTo({ left: on.offsetLeft - (nav.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' });
            }), { rootMargin: '-45% 0px -50% 0px' });
            $$('.look-sec').forEach(s => io.observe(s));
        }
        reveal();
    }

    /* ---------- bag */
    if (PAGE === 'bag') {
        const list = $('#lines'), sum = $('#summary'), savedGrid = $('#savedGrid');
        function draw() {
            if (!bag.length) {
                list.innerHTML = `<div class="empty"><p class="lede">Your bag is empty.</p><p class="copy">Find a drape on the runway or browse the full saree edit.</p><div class="row"><a class="btn" href="shop.html">Shop sarees</a><a class="btn ghost" href="index.html">See the runway</a></div></div>`;
                sum.hidden = true;
            } else {
                sum.hidden = false;
                list.innerHTML = bag.map((l, i) => {
                    const p = byId(l.id);
                    return `<article class="line">
                        <a class="ph" href="product.html?id=${p.id}">${HS.CUT[p.img] ? `<img class="cutimg" src="${HS.cut(p.img, 's')}" alt="${esc(p.name)}" loading="lazy">` : `<img src="${HS.IMG(p.img, 300, 400)}" alt="${esc(p.name)}" loading="lazy">`}</a>
                        <div class="info">
                            <small>${esc(HS.FABRIC[p.fabric])}</small>
                            <h3 class="wide"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
                            ${p.kind === 'saree' ? `<label class="sel"><span class="sr">Blouse</span><select data-blouse="${i}">${BLOUSE.map(b => `<option${b === l.blouse ? ' selected' : ''}>${b}</option>`).join('')}</select></label>` : ''}
                            <div class="qty"><button data-q="${i}" data-d="-1" aria-label="One less">&minus;</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="One more">+</button></div>
                        </div>
                        <div class="end"><span>${money(p.price * l.qty)}</span><button class="link" data-rm="${i}">Remove</button></div>
                    </article>`;
                }).join('');
                const total = bag.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
                $('#items').textContent = count();
                $('#total').textContent = money(total);
                const msg = [`Hello ${HS.SHOP.full}, I would like to order:`, '',
                    ...bag.map(l => { const p = byId(l.id); return `• ${l.qty} × ${p.name} (${money(p.price)})${l.blouse ? ` – ${l.blouse}` : ''}`; }),
                    '', `Total: ${money(total)}`, '', 'Please confirm stock and delivery. Thank you.'].join('\n');
                $('#order').href = wa(msg);
            }
            const sv = saved.map(byId);
            savedGrid.innerHTML = sv.length ? sv.map(p => card(p)).join('') : `<p class="copy">Tap the heart on any saree to keep it here.</p>`;
            $('#savedCount').textContent = sv.length ? `(${sv.length})` : '';
            reveal(savedGrid);
        }
        list.addEventListener('click', e => {
            const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
            if (q) { const l = bag[q.dataset.q]; l.qty = Math.max(1, Math.min(9, l.qty + +q.dataset.d)); sync(); }
            if (rm) { bag.splice(+rm.dataset.rm, 1); sync(); }
        });
        list.addEventListener('change', e => {
            const s = e.target.closest('[data-blouse]');
            if (!s) return;
            const l = bag[s.dataset.blouse];
            const twin = bag.find(x => x !== l && x.id === l.id && x.blouse === s.value);
            if (twin) { twin.qty = Math.min(9, twin.qty + l.qty); bag = bag.filter(x => x !== l); } else l.blouse = s.value;
            sync();
        });
        window.addEventListener('hs:change', draw);
        draw();
    }

    /* ---------- visit */
    if (PAGE === 'visit') {
        const f = $('#book');
        const pre = params.get('for');
        const el = k => f.elements[k];
        if (pre) [...el('interest').options].forEach(o => { if (o.value.toLowerCase().includes(pre)) o.selected = true; });
        const d = el('date');
        d.min = new Date().toISOString().slice(0, 10);
        f.addEventListener('submit', e => {
            e.preventDefault();
            if (!el('name').value.trim()) { el('name').focus(); toast('Please tell us your name'); return; }
            const v = k => el(k).value.trim();
            const lines = [`Hello ${HS.SHOP.full}, I would like to book a visit.`, ''];
            lines.push(`Name: ${v('name')}`);
            if (v('phone')) lines.push(`Phone: ${v('phone')}`);
            lines.push(`Boutique: ${v('boutique')}`);
            if (v('date')) lines.push(`Day: ${new Date(v('date') + 'T12:00').toDateString()}`);
            lines.push(`Looking for: ${v('interest')}`);
            if (v('msg')) lines.push('', v('msg'));
            window.open(wa(lines.join('\n')), '_blank', 'noopener');
        });
        reveal();
    }

    /* ---------- home: categories and new sarees under the runway */
    if (PAGE === 'runway') {
        const cats = $('#cats');
        if (cats) cats.innerHTML = HS.CATS.map(([k, l, img]) => {
            const n = HS.PRODUCTS.filter(p => p.fabric === k).length;
            return `<a class="cat reveal" href="shop.html?f=${k}">${HS.pic(img, 500, 733, 'cat', true, '(max-width:820px) 45vw, 16vw', 4.4 / 3)}<span>${esc(l)}<small>${n}</small></span></a>`;
        }).join('');
        const strip = $('#strip');
        if (strip) strip.innerHTML = HS.PRODUCTS.filter(p => p.kind === 'saree' && HS.CUT[p.img]).slice(0, 8).map(p => card(p)).join('');
        const strip2 = $('#strip2');
        if (strip2) strip2.innerHTML = (() => {   // a mix: bridal, party lehengas, anarkalis and groom wear
            const groups = ['bridal', 'lehenga', 'gown', 'groom'].map(f => HS.PRODUCTS.filter(p => p.fabric === f)), out = [];
            for (let i = 0; out.length < 8 && groups.some(g => g[i]); i++) groups.forEach(g => g[i] && out.length < 8 && out.push(g[i]));
            return out;
        })().map(p => card(p)).join('');
        reveal();
    }

    if (PAGE === 'house' || PAGE === 'other') reveal();
    sync();
})();
