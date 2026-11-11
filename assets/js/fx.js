/* =============================================================================
   Signature effects and demo mode, shared by every page
   1. Demo brand: ?name=Shop+Name&accent=9e1f2c re-brands the demo for a prospect
   2. Demo mode: WhatsApp, Call and social links show what would happen instead
   3. Opening curtain on the home page (full version once per visit)
   4. Page changes: soft cross-fade, and the photo you tap flies into the next page
   5. Gold sheen on headings, gold dust on the runway, pieces fly into the bag
   ============================================================================= */
(() => {
    'use strict';
    const HS = window.HS;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const ss = {
        get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
    };
    const DEMO = HS.DEMO !== false;

    /* ------------------------------------------------------------------ 1. demo brand */
    const q = new URLSearchParams(location.search);
    if (q.get('name')) ss.set('wl_name', q.get('name').slice(0, 40));
    if (q.get('accent') && /^[0-9a-f]{6}$/i.test(q.get('accent'))) ss.set('wl_accent', q.get('accent'));
    const name = ss.get('wl_name'), accent = ss.get('wl_accent');
    if (accent) document.documentElement.style.setProperty('--kumkum', '#' + accent);
    if (name) {
        const full = HS.SHOP.full, short = HS.SHOP.name;
        HS.SHOP.full = name;
        HS.SHOP.name = name.length <= 16 ? name : name.split(' ')[0];
        const swap = s => s.split(full).join(name).replace(new RegExp(`\\b${short}\\b`, 'g'), HS.SHOP.name);
        document.title = swap(document.title);
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n; (n = walk.nextNode());) if (n.nodeValue.includes(short)) n.nodeValue = swap(n.nodeValue);
        $$('[aria-label]').forEach(e => e.setAttribute('aria-label', swap(e.getAttribute('aria-label'))));
    }

    /* ------------------------------------------------------------------ 2. demo mode */
    if (DEMO) {
        const sheet = document.createElement('div');
        sheet.className = 'demo-sheet';
        sheet.setAttribute('role', 'dialog');
        sheet.setAttribute('aria-modal', 'true');
        sheet.setAttribute('aria-label', 'Demo');
        sheet.innerHTML = `<div class="ds-card"><button class="ds-x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="ds-body"></div></div>`;
        document.body.append(sheet);
        const body = $('.ds-body', sheet);
        const close = () => sheet.classList.remove('on');
        sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.ds-x')) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        const esc = HS.esc || (s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`));
        const show = (title, html) => {
            body.innerHTML = `<p class="ds-k wide">Demo website</p><h3>${title}</h3>${html}<p class="ds-note">On your shop's own website this opens for real, with your number.</p>`;
            sheet.classList.add('on');
            $('.ds-x', sheet).focus({ preventScroll: true });
        };
        HS.demoOpen = url => {
            const u = String(url);
            if (/wa\.me|whatsapp/i.test(u)) {
                let text = '';
                try { text = new URL(u).searchParams.get('text') || ''; } catch (e) { /* bad link */ }
                show('This opens WhatsApp', text
                    ? `<p class="ds-copy">The customer's message arrives ready to send:</p><div class="ds-bubble">${esc(text).replace(/\n/g, '<br>')}<span>now ✓✓</span></div>`
                    : `<p class="ds-copy">The customer chats with the shop straight away on WhatsApp.</p>`);
            } else if (/^tel:/i.test(u)) {
                show('This calls the shop', `<p class="ds-copy">On a phone, one tap dials the boutique.</p>`);
            } else if (/^mailto:/i.test(u)) {
                show('This writes an email', `<p class="ds-copy">The customer's email app opens, addressed to the shop.</p>`);
            } else {
                show('This opens your social page', `<p class="ds-copy">Facebook, Instagram and TikTok links go to the shop's own pages.</p>`);
            }
        };
        const isOut = a => /wa\.me|^tel:|^mailto:|facebook\.com|instagram\.com|tiktok\.com/i.test(a.getAttribute('href') || '');
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href]');
            if (!a || !isOut(a)) return;
            e.preventDefault();
            e.stopPropagation();
            HS.demoOpen(a.href);
        }, true);
        const open = window.open;
        window.open = (url, ...rest) => (/wa\.me/.test(String(url)) ? (HS.demoOpen(url), null) : open.call(window, url, ...rest));

        const chip = document.createElement('div');
        chip.className = 'demo-chip';
        chip.innerHTML = '<i></i><span>Demo · example pieces and prices</span><b>Demo</b>';
        chip.setAttribute('aria-label', 'Demo website: example pieces and prices');
        // on phones the label is a small "Demo" tag in the top bar (the footer explains the rest)
        chip.classList.add('mini');
        document.body.append(chip);
    }

    /* ------------------------------------------------------------------ 3. opening curtain */
    const wait = $('#wait');
    if (wait) {
        const word = $('.wword', wait);
        if (word) word.innerHTML = [...HS.SHOP.name].map((c, i) => `<b style="--i:${i}">${c === ' ' ? '&nbsp;' : HS.esc(c)}</b>`).join('');
        const seen = ss.get('wl_intro') || calm;
        ss.set('wl_intro', '1');
        wait.classList.add(seen ? 'quick' : 'full');
        HS.introMin = calm ? 0 : seen ? 650 : 1700;   // runway.js keeps the curtain closed at least this long
        HS.introDone = () => {
            const stage = $('#stage');
            if (stage && !calm) { stage.classList.add('enter'); setTimeout(() => stage.classList.remove('enter'), 2400); }
        };
    }

    /* ------------------------------------------------------------------ 4. page changes */
    // The browser cross-fades between pages (fx.css @view-transition). Tapping a photo names it
    // "pic" so it grows into the big photo on the next page.
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href]');
        if (!a || e.defaultPrevented || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
        const href = a.getAttribute('href');
        if (!/^(product|lookbook)\.html/.test(href)) return;
        const box = a.closest('.pc, .card, .look-sec, li, .m') || a;
        const img = $('img.cutimg, img.ci, img', box);
        $$('[style*="view-transition-name"]').forEach(x => x.style.viewTransitionName = '');
        if (img) img.style.viewTransitionName = 'pic';
    });
    addEventListener('pageshow', () => $$('img').forEach(x => { if (x.style.viewTransitionName) x.style.viewTransitionName = ''; }));

    if (calm) return;

    /* ------------------------------------------------------------------ 5. little luxuries */
    // product page, computers: the photo zooms in under the mouse to show the fabric
    const big = $('#main');
    if (big && matchMedia('(hover:hover) and (pointer:fine)').matches) {
        const box = big.parentElement;
        let saved = null;
        box.style.cursor = 'zoom-in';
        box.addEventListener('mouseenter', () => { saved = [big.style.transform, big.style.transformOrigin, big.style.transition]; big.style.transition = 'transform .25s ease-out'; });
        box.addEventListener('mousemove', e => {
            const r = box.getBoundingClientRect();
            big.style.transformOrigin = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`;
            big.style.transform = 'scale(2)';
        });
        box.addEventListener('mouseleave', () => { if (saved) [big.style.transform, big.style.transformOrigin, big.style.transition] = saved; });
    }

    // gold sheen across headings as they come into view
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(en => {
            if (!en.isIntersecting) return;
            en.target.classList.add('sheen');
            io.unobserve(en.target);
        }), { rootMargin: '0px 0px -12% 0px' });
        $$('.h1, .h2, .intro h2, .lost h1').forEach(h => io.observe(h));
    }

    // gold dust drifting over the runway
    const stage = $('#stage');
    if (stage) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        dust.setAttribute('aria-hidden', 'true');
        const n = innerWidth < 821 ? 10 : 18;
        for (let i = 0; i < n; i++) {
            const d = document.createElement('i');
            const s = 2 + Math.random() * 3.5;
            d.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;--dx:${(Math.random() * 60 - 30).toFixed(0)}px;animation-duration:${(9 + Math.random() * 10).toFixed(1)}s;animation-delay:-${(Math.random() * 18).toFixed(1)}s;opacity:${(.35 + Math.random() * .5).toFixed(2)}`;
            dust.append(d);
        }
        stage.prepend(dust);
        // pause when the runway is off screen
        new IntersectionObserver(([en]) => dust.classList.toggle('off', !en.isIntersecting)).observe(stage);
    }

    // a piece flies into the bag when it is added
    document.addEventListener('click', e => {
        const add = e.target.closest('[data-add], #addBtn, #barAdd, [data-look]');
        if (!add) return;
        const box = add.closest('.pc, .card, li, .look-sec, .pd, main') || document;
        const img = $('img.cutimg, img.ci, #main, img', box);
        const target = [...$$('[data-cart]')].map(x => x.closest('a') || x).find(x => x.getBoundingClientRect().width > 0);
        if (!img || !target) return;
        const a = img.getBoundingClientRect(), b = target.getBoundingClientRect();
        if (!a.width) return;
        const fly = img.cloneNode();
        fly.removeAttribute('loading');
        fly.removeAttribute('id');
        fly.className = 'fly';
        fly.style.cssText = `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;
        document.body.append(fly);
        const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
        const k = Math.max(.06, 28 / a.height);
        fly.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * .45}px,${dy * .45 - 80}px) scale(${(1 + k) / 2})`, opacity: 1, offset: .5 },
            { transform: `translate(${dx}px,${dy}px) scale(${k})`, opacity: .2 }
        ], { duration: 820, easing: 'cubic-bezier(.5,0,.2,1)' }).onfinish = () => {
            fly.remove();
            target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
        };
    });
})();
