const toast = document.querySelector('#toast');
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
};

document.querySelector('.enter-room').addEventListener('click', () => showToast('Welcome to Idea Board — start adding your big ideas.'));
document.querySelector('#add-room').addEventListener('click', () => showToast('Your room list is ready for a new space.'));
document.querySelectorAll('.room-link').forEach((room) => room.addEventListener('click', () => {
  document.querySelectorAll('.room-link').forEach((item) => item.classList.remove('current'));
  room.classList.add('current');
  showToast(`${room.textContent.trim().replace(/\d+$/, '')} selected.`);
}));
