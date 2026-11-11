/* =============================================================================
   Runway: six looks stand in a line into the distance and every drag brings
   the next one to the front. The rail on the right scrolls with them and
   shows the pieces worn in the look at the front.
   ============================================================================= */
(() => {
    'use strict';
    const HS = window.HS;
    const LOOKS = HS.LOOKS, N = LOOKS.length;
    const ITEMS = LOOKS.flatMap(l => l.pieces.map(HS.byId));   // two pieces per look
    const R = .58;                                              // arch width / height

    // depth stops from d = -1 (leaving past the rail) to d = 5 (arriving out of the haze)
    const DESK = {
        KX: [1.2, .744, .496, .346, .235, .15, .085], KF: [1.14, .89, .777, .704, .651, .616, .59],
        KH: [1.18, .832, .574, .436, .334, .258, .19]
    };
    const PHONE = {
        KX: [1.3, .64, .4, .28, .19, .12, .07], KF: [1.1, .86, .76, .7, .655, .625, .6],
        KH: [1.1, .74, .53, .41, .32, .25, .19]
    };
    const KB = [0, 0, 1.5, 4, 8, 12, 17], KO = [1, 1, 1, 1, .86, .5, 0];

    const $ = id => document.getElementById(id);
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const stage = $('stage'), rail = $('rail'), ring = $('ring'), roll = $('roll'), line = $('line');
    const lname = $('lname'), shopLook = $('shopLook'), dots = $('dots'), hint = $('hint');
    const wrap = (x, n) => ((x % n) + n) % n;
    const pad = n => String(n).padStart(2, '0');

    /* ---------- the line of looks */
    const people = LOOKS.map((l, i) => {
        const e = document.createElement('div');
        const c = HS.CUT[l.img];   // a cut-out stands on the line by itself, a photo stands in an arch
        e.className = c ? 'm cut' : 'm';
        e.dataset.i = i;
        const alt = `Look ${i + 1}: ${HS.esc(l.title)} saree`;
        e.innerHTML = c
            ? `<img class="ci" alt="${alt}" draggable="false" decoding="async" src="${HS.cut(l.img, 'm')}"><img class="cb" alt="" aria-hidden="true" draggable="false" decoding="async" src="${HS.cut(l.img, 'b')}">`
            : `<div class="a"><img alt="${alt}" draggable="false" decoding="async" src="${HS.IMG(l.img, 900, 1500)}" style="object-position:${l.pos}"></div>`;
        const img = e.querySelector('img');
        const ok = () => img.classList.add('ok');
        img.complete && img.naturalWidth ? ok() : img.addEventListener('load', ok, { once: true });
        img.addEventListener('error', ok, { once: true });
        // blurred copies are 360 tall plus a 30px margin all round (tools/sizes.py)
        const cb = e.querySelector('.cb');
        if (cb) {
            const py = 3000 / 360, px = py / (c.w / c.h);   // margin in % of the model's height and width
            cb.style.cssText = `top:-${py.toFixed(3)}%;left:-${px.toFixed(3)}%;width:${(100 + 2 * px).toFixed(3)}%;height:${(100 + 2 * py).toFixed(3)}%`;
        }
        line.append(e);
        return { e, img, soft: cb, r: c ? c.w / c.h : R, f: '', o: '', s: '' };
    });

    /* ---------- the rail of pieces */
    const cards = ITEMS.map((p, i) => {
        const e = document.createElement('article');
        e.className = 'card' + (i % 2 ? ' alt' : '');
        e.innerHTML = `<button class="fav" data-fav="${p.id}" aria-pressed="false" aria-label="Save ${HS.esc(p.name)}">${HS.heart}</button>
            <a class="shot" href="product.html?id=${p.id}" draggable="false" tabindex="-1" aria-hidden="true">${HS.CUT[p.img] ? `<img class="cutimg" src="${HS.cut(p.img, 's')}" alt="" loading="lazy" draggable="false">` : `<img src="${HS.IMG(p.img, 500, 640)}" alt="" loading="lazy" draggable="false">`}</a>
            <div class="meta">
                <h3 class="wide"><a href="product.html?id=${p.id}">${HS.esc(p.name)}</a></h3>
                <span>${HS.money(p.price)}</span>
                <button class="add" data-add="${p.id}" aria-label="Add ${HS.esc(p.name)} to bag"></button>
            </div>`;
        rail.append(e);
        return e;
    });
    window.dispatchEvent(new CustomEvent('hs:change'));

    /* ---------- rolling number + dots */
    for (let i = 0; i <= N; i++) {
        const b = document.createElement('b');
        b.textContent = pad((i % N) + 1);
        roll.append(b);
    }
    dots.innerHTML = LOOKS.map(() => '<i></i>').join('');

    let p = 0, target = 0, dragging = false, startX = 0, startY = 0, startP = 0, moved = false, wheelTimer = null, dragScale = 1, dragAxis = 'x';
    let rx = 0, ry = 0, tx = 0, ty = 0, hasMouse = false, dirty = true, current = -1;

    // start on the look named in the address, e.g. index.html#look-3
    const fromHash = /look-(\d)/.exec(location.hash);
    if (fromHash) p = target = Math.max(0, Math.min(N - 1, fromHash[1] - 1));

    function lerp(table, d) {
        if (d <= -1) return table[0];
        if (d >= 5) return table[6];
        const i = Math.floor(d + 1), t = d + 1 - i;
        return table[i] * (1 - t) + table[i + 1] * t;
    }

    let sw = 0, sh = 0, rh = 0, mobile = false, unit = 1;
    function measure() {
        sw = stage.clientWidth; sh = stage.clientHeight; rh = rail.clientHeight;
        mobile = innerWidth <= 820;
        unit = parseFloat(getComputedStyle(roll.firstChild).height) || 38;
        dirty = true;
    }

    function setCurrent(i) {
        if (i === current) return;
        const firstTime = current === -1;
        current = i;
        const l = LOOKS[i];
        clearTimeout(setCurrent.t);
        lname.classList.add('out');
        setCurrent.t = setTimeout(() => {
            lname.innerHTML = `${HS.esc(l.name)}<small>${HS.esc(l.title)}</small>`;
            lname.classList.remove('out');
        }, firstTime ? 0 : 180);
        shopLook.href = `lookbook.html#look-${i + 1}`;
        shopLook.setAttribute('aria-label', `Shop look ${i + 1}, ${l.name}`);
        [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
        people.forEach((m, j) => m.e.setAttribute('aria-hidden', j !== i));
    }

    function render() {
        const K = mobile ? PHONE : DESK;
        people.forEach((item, i) => {
            let d = wrap(i - p, N);
            if (d > 5) d -= N;

            const x = lerp(K.KX, d) * sw;
            const feetY = lerp(K.KF, d) * sh;
            const h = lerp(K.KH, d) * sh;
            const w = h * item.r;
            const blur = lerp(KB, d);
            const opacity = lerp(KO, d);

            const baseH = sh * 1.2;
            const scale = h / baseH;
            const left = x - w / 2;
            const top = feetY - h;

            // cut-outs: fade into a ready-blurred copy (cheap); arch photos: live blur as before
            const soft = item.soft ? Math.min(1, blur / (10 * h / 360)) : 0;
            const filter = item.soft || blur <= .1 ? 'none' : `blur(${(blur / scale).toFixed(1)}px)`;

            item.e.style.width = `${(baseH * item.r).toFixed(1)}px`;
            item.e.style.height = `${baseH.toFixed(1)}px`;
            item.e.style.zIndex = 100 - Math.round(d * 10);
            item.e.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
            item.e.style.pointerEvents = opacity < .05 ? 'none' : '';

            if (item.f !== filter) { item.e.style.filter = filter; item.f = filter; }
            if (item.soft) {
                const sv = soft.toFixed(2);
                if (item.s !== sv) { item.soft.style.opacity = sv; item.img.style.opacity = sv > .98 ? 0 : ''; item.s = sv; }
            }
            const o = opacity.toFixed(2);
            if (item.o !== o) { item.e.style.opacity = o; item.o = o; }
        });

        roll.style.transform = `translate3d(0,${(-wrap(p, N) * unit).toFixed(1)}px,0)`;

        const total = ITEMS.length;
        if (mobile) {
            const cardW = cards[0].offsetWidth || 164;
            cards.forEach((card, i) => {
                let cx = wrap(i * cardW - p * 2 * cardW, total * cardW);
                if (cx > total * cardW - cardW * 3) cx -= total * cardW;
                card.style.transform = `translate3d(${cx.toFixed(1)}px,0,0)`;
                card.style.height = '';
            });
        } else {
            const cardH = rh / 3;
            cards.forEach((card, i) => {
                let cy = wrap(i * cardH - p * 2 * cardH, total * cardH);
                if (cy > total * cardH - cardH * 3) cy -= total * cardH;
                card.style.transform = `translate3d(0,${cy.toFixed(1)}px,0)`;
                card.style.height = `${cardH.toFixed(1)}px`;
            });
        }
        setCurrent(wrap(Math.round(p), N));
    }

    function renderRing() {
        rx += (tx - rx) * .32;
        ry += (ty - ry) * .32;
        ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
        return Math.abs(tx - rx) + Math.abs(ty - ry) > .2;
    }

    let lastTime = performance.now();
    function tick(now) {
        const dt = Math.min(now - lastTime, 50);
        lastTime = now;
        const diff = target - p;
        if (diff !== 0) {
            if (calm || Math.abs(diff) < .0004) p = target;
            else p += diff * (1 - Math.exp(-dt * .0072));
            dirty = true;
        }
        if (dirty) { render(); dirty = false; }
        if (hasMouse) renderRing();
        requestAnimationFrame(tick);
    }

    /* ---------- interaction */
    const go = n => { target = Math.round(target) + n; seen(); };
    let touched = false;
    function seen() { hint.classList.add('gone'); touched = true; }

    // walk the line by itself until the visitor takes over (only while the runway is on screen)
    let onScreen = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; stage.classList.toggle('off', !onScreen); }).observe(stage);   // off screen: the models are not drawn at all
    if (!calm) setInterval(() => {
        if (touched || !onScreen || document.hidden || dragging || stage.matches(':hover')) return;
        target = Math.round(target) + 1;
        hint.classList.add('gone');
    }, 5200);
    setTimeout(() => hint.classList.add('gone'), 5200);

    function startDrag(e, scale, axis) {
        if (e.button !== 0) return;
        dragging = true; moved = false; dragScale = scale; dragAxis = axis;
        startX = e.clientX; startY = e.clientY; startP = target;
    }
    function moveDrag(e, el) {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        const delta = dragAxis === 'x' ? dx : dy;
        if (!moved && Math.abs(delta) > 6) {
            moved = true;
            el.setPointerCapture?.(e.pointerId);
            ring.classList.add('drag');
            seen();
        }
        if (moved) target = startP + delta / dragScale;
    }
    function endDrag() {
        if (!dragging) return;
        dragging = false;
        ring.classList.remove('drag');
        if (moved) target = Math.round(target);
    }

    // the stage: drag right to bring the next look forward
    stage.addEventListener('pointerdown', e => startDrag(e, Math.max(150, stage.clientWidth * .2), 'x'));
    stage.addEventListener('pointermove', e => {
        if (e.pointerType === 'mouse') {
            const rect = stage.getBoundingClientRect();
            tx = e.clientX - rect.left; ty = e.clientY - rect.top;
            if (!hasMouse) { rx = tx; ry = ty; hasMouse = true; }
            ring.classList.add('show');
            const m = e.target.closest('.m');
            ring.classList.toggle('view', !dragging && !!m && +m.dataset.i === current);
        }
        moveDrag(e, stage);
    });
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('mouseleave', () => ring.classList.remove('show'));
    stage.addEventListener('pointerover', e => { if (e.target.closest('.ctrl, .shop')) ring.classList.remove('show'); });

    // the rail: drag the pieces along (up and down on a computer, sideways on a phone)
    rail.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        startDrag(e, mobile ? -(cards[0].offsetWidth || 164) * 2 : -(rh / 3) * 2, mobile ? 'x' : 'y');
    });
    rail.addEventListener('pointermove', e => moveDrag(e, rail));
    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

    stage.addEventListener('click', e => {
        if (moved) { moved = false; return; }
        const m = e.target.closest('.m');
        if (!m) return;
        const i = +m.dataset.i;
        if (i === current && Math.abs(target - p) < .05) { location.href = `lookbook.html#look-${i + 1}`; return; }
        let diff = i - wrap(Math.round(target), N);
        if (diff > N / 2) diff -= N;
        if (diff < -N / 2) diff += N;
        target = Math.round(target) + diff;
        seen();
    });

    // over the stage, sideways scrolling (trackpad swipe or shift + wheel) walks the line and
    // up/down scrolls the page; over the rail, the wheel moves the pieces as in the original
    function onWheel(e) {
        const onRail = e.currentTarget === rail && !mobile;
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        const delta = onRail ? e.deltaY + e.deltaX : (Math.abs(dx) > Math.abs(e.deltaY) ? dx : 0);
        if (!delta) return;
        e.preventDefault();
        target += Math.max(-120, Math.min(120, delta)) / 420;
        seen();
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => { target = Math.round(target); }, 150);
    }
    stage.addEventListener('wheel', onWheel, { passive: false });
    rail.addEventListener('wheel', onWheel, { passive: false });

    document.addEventListener('keydown', e => {
        if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.documentElement.classList.contains('menu-open')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        else if (e.key === 'Enter' && document.activeElement === stage) location.href = shopLook.href;
    });
    $('next').addEventListener('click', () => go(1));
    $('prev').addEventListener('click', () => go(-1));

    addEventListener('resize', measure);
    window.addEventListener('hs:change', () => { dirty = true; });

    /* ---------- wait for the first looks, but never longer than 2.5s */
    let shown = false;
    const t0 = performance.now();
    const reveal = () => {
        if (shown) return;
        shown = true;
        (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
            measure();
            // fx.js asks for the opening curtain to stay closed a moment on the first visit
            setTimeout(() => { $('wait').classList.add('gone'); HS.introDone?.(); }, Math.max(0, (HS.introMin || 0) - (performance.now() - t0)));
        });
    };
    const first = [people[wrap(Math.round(p), N)].img, people[wrap(Math.round(p) + 1, N)].soft || people[wrap(Math.round(p) + 1, N)].img];
    let loaded = 0;
    first.forEach(img => {
        const done = () => { if (++loaded >= first.length) reveal(); };
        img.complete ? done() : (img.addEventListener('load', done, { once: true }), img.addEventListener('error', done, { once: true }));
    });
    setTimeout(reveal, 2500);

    measure();
    requestAnimationFrame(tick);
})();
