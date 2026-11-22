const booking = document.querySelector('#booking-form');
function copyButton(text) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'btn'; button.textContent = 'Copy request';
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(text); button.textContent = 'Copied — share with the studio'; }
    catch { button.textContent = 'Select and copy the request above'; }
  });
  return button;
}
if (booking) {
  const chosenStyle = new URLSearchParams(location.search).get('style');
  if (chosenStyle) booking.elements.remarks.value = 'I’m interested in: ' + chosenStyle.slice(0,250);
  const now = new Date();
  booking.elements.date.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  booking.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(booking);
    const summary = `Appointment request\nName: ${data.get('name')}\nMobile: ${data.get('phone')}\nService: ${data.get('service')}\nPreferred date: ${data.get('date')}\nTime preference: ${data.get('time')}\nWhat I’m planning: ${data.get('remarks') || 'Discuss with the studio'}`;
    const panel = document.querySelector('#booking-review'); panel.replaceChildren(); panel.hidden = false;
    const heading = document.createElement('h3'); heading.textContent = 'Your request is ready';
    const note = document.createElement('p'); note.textContent = 'This has not been sent or booked. Copy your request to share with the studio on Instagram, or call to confirm availability.';
    const pre = document.createElement('pre'); pre.textContent = summary;
    panel.append(heading,note,pre,copyButton(summary)); panel.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
const enquiry = document.querySelector('#academy-form');
if (enquiry) enquiry.addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(enquiry);
  const summary = `Academy enquiry\nName: ${data.get('name')}\nCourse: ${data.get('course')}\nMy goals: ${data.get('goals') || 'Please help me choose a course'}`;
  const panel = document.querySelector('#academy-status'); panel.replaceChildren();
  const message = document.createElement('p'); message.textContent = 'Your enquiry is ready to share. Copy it and message the studio on Instagram, or call +91 99861 53243. It has not been sent automatically.';
  const pre = document.createElement('pre'); pre.textContent = summary; panel.append(message,pre,copyButton(summary));
});
const dialog = document.querySelector('#lesson-dialog');
if (dialog) {
  document.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#lesson-title').textContent = button.dataset.lesson; dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
