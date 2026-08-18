function onAnimeReady(callback) {
  if (window.anime) return callback(window.anime);
  window.addEventListener('animeready', () => callback(window.anime), { once: true });
}

function revealHero() {
  const h1 = document.querySelector('.hero h1');
  if (!h1 || h1.dataset.revealed) return;
  h1.dataset.revealed = 'true';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    h1.style.opacity = '1';
    return;
  }

  const fallback = setTimeout(() => { h1.style.opacity = '1'; }, 1500);
  onAnimeReady(({ splitText, animate, stagger }) => {
    clearTimeout(fallback);
    const split = splitText(h1, { lines: true });
    animate(split.lines, {
      opacity: [0, 1],
      translateY: ['1.2em', 0],
      delay: stagger(90),
      duration: 700,
      ease: 'easeOutExpo',
    });
    h1.style.opacity = '1';
  });
}

const CARD_SELECTOR = '.flow article, .metric, .evidence, .compare > div, .chart, .pipeline > div, .table, .safer-grid article, .breakdown, .process-map, .process-node, .disco-media, .method-steps > div';

function initCardReveal() {
  if (!window.anime) return;
  const { svg, animate, onScroll } = window.anime;

  document.querySelectorAll(CARD_SELECTOR).forEach(el => {
    if (el.dataset.drawReveal) return;
    el.dataset.drawReveal = 'pending';

    const style = getComputedStyle(el);
    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const strokeWidth = parseFloat(style.borderTopWidth) || 1;
    const stroke = style.borderTopColor;
    if (style.position === 'static') el.style.position = 'relative';
    el.style.borderColor = 'transparent';

    // ponytail: sized once at reveal time; a live resize/reflow after this won't
    // re-measure the overlay. Add a ResizeObserver if the grid becomes fluid.
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    const svgNs = 'http://www.w3.org/2000/svg';
    const overlay = document.createElementNS(svgNs, 'svg');
    overlay.setAttribute('class', 'draw-reveal-outline');
    // Absolutely positioned children align to the ancestor's *padding* box, not
    // its border box, so the overlay is outset by the stroke width here to land
    // exactly on the original border edge instead of drifting inward at corners.
    overlay.style.cssText = `position:absolute;top:-${strokeWidth}px;left:-${strokeWidth}px;width:${width}px;height:${height}px;pointer-events:none`;
    const rect = document.createElementNS(svgNs, 'rect');
    rect.setAttribute('x', strokeWidth / 2);
    rect.setAttribute('y', strokeWidth / 2);
    rect.setAttribute('width', width - strokeWidth);
    rect.setAttribute('height', height - strokeWidth);
    rect.setAttribute('rx', radius);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth);
    overlay.appendChild(rect);
    el.appendChild(overlay);

    const [drawable] = svg.createDrawable(rect);
    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 900,
      ease: 'easeInOutQuad',
      autoplay: onScroll({ target: el, repeat: false }),
    });
  });
}
