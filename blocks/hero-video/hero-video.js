export default function decorate(block) {
  // Detect a poster image; if absent, mark as no-image so text uses default color.
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Background video support: a row may provide a link to a video file (.mp4).
  // Convert it into a muted, looping, autoplay background <video> behind the content.
  const videoLink = block.querySelector('a[href$=".mp4"], a[href*=".mp4?"]');
  if (videoLink) {
    const wrapper = videoLink.closest('div');
    const video = document.createElement('video');
    video.className = 'hero-video-bg';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    // Use a poster image if one was provided in the same column.
    const poster = block.querySelector('picture img');
    if (poster) video.poster = poster.src;
    const source = document.createElement('source');
    source.src = videoLink.getAttribute('href');
    source.type = 'video/mp4';
    video.append(source);
    if (wrapper) {
      wrapper.replaceChildren(video);
      wrapper.classList.add('hero-video-media');
    }
    block.classList.remove('no-image');
  }
}
