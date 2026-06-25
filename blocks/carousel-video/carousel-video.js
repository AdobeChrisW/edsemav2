import { moveInstrumentation } from '../../scripts/scripts.js';

// Document Authoring project: no placeholders sheet wired up. ARIA strings use
// literal English fallbacks below, so this returns an empty object.
const fetchPlaceholders = async () => ({});

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-video');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-video-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-video-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-video-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-video-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-video-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-video-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

// Build a playable <video> element from a slide row. Each row has a poster
// <picture> in one cell and an <a> link to a .mp4 in another cell. The poster
// image becomes the video poster, the link becomes the <source>. Controls are
// enabled, metadata preloaded, and playback is NOT autoplayed.
function buildSlideVideo(row) {
  const link = row.querySelector('a[href$=".mp4"], a[href*=".mp4?"]');
  const poster = row.querySelector('picture img');

  const media = document.createElement('div');
  media.classList.add('carousel-video-slide-image');

  const video = document.createElement('video');
  video.className = 'carousel-video-media';
  video.controls = true;
  video.preload = 'metadata';
  video.playsInline = true;
  if (poster) video.poster = poster.currentSrc || poster.src;

  if (link) {
    const source = document.createElement('source');
    source.src = link.getAttribute('href');
    source.type = 'video/mp4';
    video.append(source);
  }

  media.append(video);
  return media;
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-video-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-video-slide');

  slide.append(buildSlideVideo(row));

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-video-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-video-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-video-slides');
  container.append(slidesWrapper);

  // Controls row sits below the video: prev/next buttons on the leading edge,
  // dot indicators on the trailing edge (matches source embla layout).
  let slideIndicators;
  let controls;
  if (!isSingleSlide) {
    controls = document.createElement('div');
    controls.classList.add('carousel-video-controls');

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-video-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    controls.append(slideNavButtons);

    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-video-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    controls.append(slideIndicatorsNav);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-video-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  block.prepend(container);
  if (controls) block.append(controls);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
