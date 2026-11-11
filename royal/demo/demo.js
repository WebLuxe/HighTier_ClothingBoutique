/* =============================================================================
   Demo mode for the WebLuxe clothing demos (load right after data.js).
   - Shows the edits made in the demo admin panel (kept in this browser).
   - WhatsApp, Call, email and social links show what would happen instead.
   - "Demo" label with a link to the owner's panel.
   - ?name=Shop+Name re-brands the demo for a prospect (kept for the visit).
   Set window.WL_DEMO = false before this file to switch all of it off.
   ============================================================================= */
(() => {
    'use strict';
    if (window.WL_DEMO === false) return;
    const CFG = Object.assign({ full: 'WebLuxe High Fashion Boutique', short: 'WebLuxe', admin: 'admin/', label: 'Demo · example pieces and prices' }, window.WL_DEMO || {});
    const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, del(k) { try { localStorage.removeItem(k); } catch (e) { /* */ } } };
    const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* */ } } };

    /* edits from the demo admin panel replace the example data */
    // one copy per site: all the demos share one web address (webluxe.github.io)
    const KEY = 'wl_demo_data:' + location.pathname.split('/')[1];
    let edited = false;
    try {
        const d = JSON.parse(ls.get(KEY) || 'null');
        if (d && Array.isArray(d.products)) { window.SITE_DATA = d; edited = true; }
    } catch (e) { /* ignore broken demo data */ }

    const q = new URLSearchParams(location.search);
    if (q.get('name')) ss.set('wl_name', q.get('name').slice(0, 40));
    const name = ss.get('wl_name');

    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function ready() {
        /* re-brand */
        if (name) {
            const short = name.length <= 16 ? name : name.split(' ')[0];
            const swap = s => s.split(CFG.full).join(name).split(CFG.short.toUpperCase()).join(short.toUpperCase()).split(CFG.short).join(short);
            document.title = swap(document.title);
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            for (let n; (n = walk.nextNode());) if (/webluxe/i.test(n.nodeValue)) n.nodeValue = swap(n.nodeValue);
        }

        /* the popup */
        const sheet = document.createElement('div');
        sheet.className = 'wl-sheet';
        sheet.setAttribute('role', 'dialog');
        sheet.setAttribute('aria-modal', 'true');
        sheet.setAttribute('aria-label', 'Demo');
        sheet.innerHTML = '<div class="wl-card"><button class="wl-x" aria-label="Close">&times;</button><div class="wl-body"></div></div>';
        document.body.append(sheet);
        const body = sheet.querySelector('.wl-body');
        const close = () => sheet.classList.remove('on');
        sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.wl-x')) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        const show = (title, html) => {
            body.innerHTML = `<p class="wl-k">Demo website</p><h3>${title}</h3>${html}<p class="wl-note">On your shop's own website this opens for real, with your number.</p>`;
            sheet.classList.add('on');
        };
        const demoOpen = url => {
            const u = String(url);
            if (/wa\.me|whatsapp/i.test(u)) {
                let text = '';
                try { text = new URL(u).searchParams.get('text') || ''; } catch (e) { /* */ }
                if (name) text = text.split(CFG.full).join(name);
                show('This opens WhatsApp', text
                    ? `<p class="wl-copy">The customer's message arrives ready to send:</p><div class="wl-bubble">${esc(text).replace(/\n/g, '<br>')}<span>now ✓✓</span></div>`
                    : '<p class="wl-copy">The customer chats with the shop straight away on WhatsApp.</p>');
            } else if (/^tel:/i.test(u)) show('This calls the shop', '<p class="wl-copy">On a phone, one tap dials the boutique.</p>');
            else if (/^mailto:/i.test(u)) show('This writes an email', '<p class="wl-copy">The customer\'s email app opens, addressed to the shop.</p>');
            else show('This opens your social page', '<p class="wl-copy">Facebook, Instagram and TikTok links go to the shop\'s own pages.</p>');
        };
        window.WL_demoOpen = demoOpen;
        const isOut = h => /wa\.me|^tel:|^mailto:|facebook\.com|instagram\.com|tiktok\.com/i.test(h || '');
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href]');
            if (!a || !isOut(a.getAttribute('href'))) return;
            e.preventDefault(); e.stopPropagation();
            demoOpen(a.href);
        }, true);
        const open = window.open;
        window.open = (url, ...rest) => (isOut(String(url)) ? (demoOpen(url), null) : open.call(window, url, ...rest));

        /* the label */
        const chip = document.createElement('div');
        chip.className = 'wl-chip';
        chip.innerHTML = `<i></i><em>Demo</em><span>${edited ? 'Showing your demo edits' : esc(CFG.label)}</span>` +
            (CFG.admin ? `<a href="${CFG.admin}">${edited ? 'Edit' : 'Owner panel'} &rarr;</a>` : '') +
            (edited ? '<button type="button">Reset</button>' : '');
        document.body.append(chip);
        chip.querySelector('button')?.addEventListener('click', () => { ls.del(KEY); location.reload(); });
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
})();
