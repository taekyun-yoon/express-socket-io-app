// const express = require('express')
// const app = express()

// const publicDirectoryPath = path.join(__dirname, '../public');
// app.use(express.static(publicDirectoryPath));

// const port = 8080
// app.listen(port, () => console.log(`app listening on port ${port}!`))
const socket = io();
console.log(socket);

const query = new URLSearchParams(location.search);
const username = query.get('username');
const room = query.get('room');

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    };
});


const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    console.log(html);
    messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
}) 

function scrollToBottom() {
    messages.scrollToBottom = messages.scrollHeight;
}


const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, users
    })
    document.querySelector('#sidebar').innerHTML = html;
})

const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;

    console.log('send message ', message);
    socket.emit('sendMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();

        if(error) {
            return console.log(error);
        }
    })
})
