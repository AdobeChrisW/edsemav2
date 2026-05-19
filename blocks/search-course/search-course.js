/**
 * Search Course Block
 * Course finder form with keyword search, study level dropdown, and submit button.
 * Matches the University of Nottingham homepage search section design.
 */
export default async function decorate(block) {
  // Extract configuration from block content before clearing
  const link = block.querySelector('a[href]');
  const searchAction = link?.href || '/studywithus/courses/find-a-course.aspx';

  // Clear the authored content - we rebuild the UI
  block.innerHTML = '';

  // Build heading
  const heading = document.createElement('h2');
  heading.textContent = 'Find your dream course';
  heading.className = 'search-course-title';

  // Build form
  const form = document.createElement('form');
  form.className = 'search-course-form';
  form.setAttribute('role', 'search');
  form.setAttribute('aria-label', 'Course search');
  form.action = searchAction;
  form.method = 'get';

  // Keyword input field
  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search-course-field search-course-keyword';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search our courses...';
  input.setAttribute('aria-label', 'Search our courses');
  inputWrapper.append(input);

  // Study level dropdown
  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'search-course-field search-course-level';
  const select = document.createElement('select');
  select.name = 'level';
  select.setAttribute('aria-label', 'Select study level');
  const levels = [
    {
      value: '', label: 'Select study level', disabled: true, selected: true,
    },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'research', label: 'Research opportunities' },
    { value: 'apprenticeships', label: 'Apprenticeships' },
    { value: 'online', label: 'Online' },
    { value: 'preparatory-english', label: 'Preparatory English' },
  ];
  levels.forEach(({
    value, label, disabled, selected,
  }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (disabled) option.disabled = true;
    if (selected) option.selected = true;
    select.append(option);
  });
  selectWrapper.append(select);

  // Submit button
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'search-course-field search-course-submit';
  const button = document.createElement('button');
  button.type = 'submit';
  button.innerHTML = '<span class="search-course-btn-text">Let\'s go</span><span class="search-course-btn-arrow" aria-hidden="true">&#x203A;</span>';
  buttonWrapper.append(button);

  // Assemble form
  form.append(inputWrapper, selectWrapper, buttonWrapper);

  // Assemble block
  block.append(heading, form);
}
