/* =============================================================================
   "Compare packages": a button in the demo label that lists the three clothing
   demos with what each includes, so a prospect can jump between them.
   The three demos live next to each other: ../<repo>/ (on GitHub Pages and locally).
   ============================================================================= */
(() => {
    'use strict';
    const TIERS = [
        ['LowTier_ClothingBoutique', 'Starter', '', 'An organised online shop: menus, offers, filters, a page for every piece, bag and orders on WhatsApp.'],
        ['MidTier_ClothingBoutique', 'Business', '', 'The maroon boutique: opening curtain, silk-pleat transitions between tabs, gold effects, quick view, bag and booking form.'],
        ['HighTier_ClothingBoutique', 'Signature', '', 'The showpiece: runway of models, lookbook, opening curtain, photo transitions between pages and cinematic effects.']
    ];
    const here = location.pathname.split('/')[1];

    function add(tries = 0) {
        const chip = document.querySelector('.wl-chip, .demo-chip');
        if (!chip) { if (tries < 20) setTimeout(() => add(tries + 1), 150); return; }
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wl-tiers-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span class="lg">Compare packages</span><span class="sm">Packages</span>';
        chip.append(btn);

        const panel = document.createElement('div');
        panel.className = 'wl-tiers';
        panel.hidden = true;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Website packages');
        panel.innerHTML = '<p class="wl-tiers-h">Three website packages for the same shop</p>' +
            TIERS.map(([repo, name, price, text]) => `<a href="../${repo}/"${repo === here ? ' aria-current="page"' : ''}>
                <span><b>${name}</b></span><small>${text}</small>${repo === here ? '<i>You are here</i>' : ''}</a>`).join('') +
            '<p class="wl-tiers-f">Pieces, photos and prices on these sites are examples.</p>';
        document.body.append(panel);

        const place = () => {
            const r = chip.getBoundingClientRect();
            panel.style.left = Math.max(12, Math.min(r.left, innerWidth - panel.offsetWidth - 12)) + 'px';
            if (r.top > innerHeight / 2) { panel.style.top = 'auto'; panel.style.bottom = (innerHeight - r.top + 8) + 'px'; }
            else { panel.style.bottom = 'auto'; panel.style.top = (r.bottom + 8) + 'px'; }
        };
        const show = on => { panel.hidden = !on; btn.setAttribute('aria-expanded', on); if (on) place(); };
        btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); show(panel.hidden); });
        document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target)) show(false); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') show(false); });
        addEventListener('resize', () => { if (!panel.hidden) place(); });
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => add()) : add();
})();
