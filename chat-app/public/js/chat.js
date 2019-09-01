const socket = io();

const $chatForm = document.querySelector('#chat-form');
const $chatFormInput = document.querySelector('#message-input');
const $buttonSubmit = document.querySelector('#message-button');
const $buttonShareLocation = document.querySelector('#share-location');
const $messages = document.querySelector('.chat__messages');
const $sidebar = document.querySelector('.chat__sidebar');

const username = new URLSearchParams(window.location.search).get('username');
const room = new URLSearchParams(window.location.search).get('room');

const autoscroll = () => {
  const $lastMessage = $messages.lastElementChild;

  // Get height of last message, including margins
  const lastMessageComputedStyles = getComputedStyle($lastMessage);
  const lastMessageMarginBottom = parseInt(
    lastMessageComputedStyles.marginBottom
  );
  const lastMessageHeight = $lastMessage.offsetHeight + lastMessageMarginBottom;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Container scrollable height
  const messagesCntainerHeight = $messages.scrollHeight;

  // Get far did I scroll to bottom
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (messagesCntainerHeight - lastMessageHeight <= scrollOffset) {
    $messages.scrollTop = messagesCntainerHeight;
  }
};

socket.on('message', ({ author, text, createdAt }) => {
  const date = moment(createdAt).format('h:mm a');
  const html = `<div class="message">
                  <p>
                    <span class="message__name">${author}</span>
                    <span class="message__meta">${date}</span>
                  </p>
                  <p>${text}</p>
                </div>`;

  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', ({ author, url, createdAt }) => {
  const date = moment(createdAt).format('h:mm a');
  const html = `<div class="message">
                  <p>
                    <span class="message__name">${author}</span>
                    <span class="message__meta">${date}</span>
                  </p>
                  <p>
                    <a href="${url}" target="_blank">My Location</a>
                  </p>
                </div>`;

  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('userListUpdated', ({ users, room }) => {
  const html = `
    <h2 class="room-title">${room}</h2>
    <h3 class="list-title">Users</h3>
    <ul class="users">${users
      .map(user => `<li>${user.username}</li>`)
      .join('')}</ul>
  `;

  $sidebar.innerHTML = html;
});

$chatForm.addEventListener('submit', e => {
  e.preventDefault();

  $buttonSubmit.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, error => {
    $buttonSubmit.removeAttribute('disabled');
    e.target.elements.message.value = '';
    e.target.elements.message.focus();

    if (error) {
      return console.log(error);
    }
  });
});

$buttonShareLocation.addEventListener('click', function() {
  if (navigator.geolocation) {
    this.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
      const location = {
        long: position.coords.latitude,
        lat: position.coords.longitude
      };

      socket.emit('sendLocation', location, response => {
        this.removeAttribute('disabled');
        console.log(response);
      });
    });
  } else {
    alert('Your browse does not support this feature!');
  }
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
