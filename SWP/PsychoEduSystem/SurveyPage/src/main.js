// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginBtn = document.getElementById('loginBtn');
const startSurveyBtn = document.getElementById('startSurveyBtn');
const skipSurveyBtn = document.getElementById('skipSurveyBtn');
const modal = document.getElementById('modal');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

// State
let isLoggedIn = false;

// Toggle mobile menu
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const icon = menuBtn.querySelector('i');
  if (mobileMenu.classList.contains('hidden')) {
    icon.setAttribute('data-lucide', 'menu');
  } else {
    icon.setAttribute('data-lucide', 'x');
  }
  lucide.createIcons();
});

// Handle login
loginBtn.addEventListener('click', () => {
  isLoggedIn = !isLoggedIn;
  if (isLoggedIn) {
    alert('You are now logged in!');
  }
});

// Handle start survey
startSurveyBtn.addEventListener('click', () => {
  if (!isLoggedIn) {
    alert('You need to log in to take the survey');
    return;
  }
  // Will navigate to survey form
  alert('Starting survey...');
});

// Handle skip survey
skipSurveyBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Handle modal actions
modalCancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modalConfirmBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  // Handle skip confirmation
  console.log('Navigating to home page...');
});

// Close modal when clicking overlay
modal.querySelector('.modal-overlay').addEventListener('click', () => {
  modal.classList.add('hidden');
});