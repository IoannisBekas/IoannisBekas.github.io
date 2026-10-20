document.documentElement.classList.add('js');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const progress = document.querySelector('.scroll-progress span');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const qualificationHover = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.qualifications details').forEach(details => {
  const summary = details.querySelector('summary');
  let mouseHovered = false;
  let expanded = details.open;
  let animation = null;

  function finishExpansion() {
    animation?.cancel();
    animation = null;
    details.open = expanded;
    details.style.overflow = '';
    details.classList.remove('is-collapsing');
    updateScroll();
  }

  function setExpanded(nextExpanded) {
    if (nextExpanded === expanded) return;
    expanded = nextExpanded;
    if (reducedMotion.matches || typeof details.animate !== 'function') {
      finishExpansion();
      return;
    }

    const startHeight = details.getBoundingClientRect().height;
    animation?.cancel();
    details.open = true;
    details.style.overflow = 'hidden';
    details.classList.toggle('is-collapsing', !expanded);
    const border = getComputedStyle(details);
    const closedHeight = summary.getBoundingClientRect().height
      + parseFloat(border.borderTopWidth) + parseFloat(border.borderBottomWidth);
    const endHeight = expanded ? details.getBoundingClientRect().height : closedHeight;
    const nextAnimation = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 400, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
    );
    animation = nextAnimation;
    nextAnimation.onfinish = () => {
      if (animation === nextAnimation) finishExpansion();
    };
  }

  details.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !qualificationHover.matches) return;
    mouseHovered = true;
    setExpanded(true);
  });
  function endMouseHover(event) {
    if (event.pointerType !== 'mouse') return;
    mouseHovered = false;
    if (!details.querySelector(':focus-visible')) setExpanded(false);
  }
  details.addEventListener('pointerleave', endMouseHover);
  details.addEventListener('pointercancel', endMouseHover);
  summary.addEventListener('click', event => {
    event.preventDefault();
    if (mouseHovered && event.detail > 0 && event.pointerType !== 'touch') {
      return;
    }
    setExpanded(!expanded);
  });
  details.addEventListener('focusout', event => {
    if (!details.contains(event.relatedTarget) && !mouseHovered) setExpanded(false);
  });
  window.addEventListener('resize', () => {
    if (animation) finishExpansion();
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

let scheduled = false;
function updateScroll() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  header.classList.toggle('scrolled', window.scrollY > 40);
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    window.requestAnimationFrame(updateScroll);
  }
}, { passive: true });
window.addEventListener('resize', () => {
  updateScroll();
  if (window.innerWidth > 760) closeMenu();
});
window.addEventListener('load', updateScroll);
document.addEventListener('toggle', updateScroll, true);
document.getElementById('year').textContent = new Date().getFullYear();
updateScroll();
