const socket = io() // web socket connected with window.location url.

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name_input')
const messageFORM = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageTone = new Audio('/message-tone.mp3') // to add audio tone.

messageFORM.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients : ${data}`
})


function sendMessage(){
    if(messageInput.value === '')return
   // console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message : messageInput.value,
        dateTime : new Date()
    }

    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message',(data) => {
   // console.log(data)
   messageTone.play()
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage, data){
    clearfeedback()
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
    ${data.message}   </p>
    <span>${data.name}. ${moment(data.dateTime).fromNow()}</span>
 
  </li>`
  messageContainer.innerHTML += element
  scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0 , messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) =>{
    socket.emit('feedback',{
        feedback: `✍️${ nameInput.value} is typing a message`,
    })
})

messageInput.addEventListener('keypress', (e) =>{
    socket.emit('feedback',{
        feedback: `✍️${nameInput.value} is typing a message`,
    })
})
messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback',{
        feedback: '',
    })
})

socket.on('feedback', (data) => {
    clearfeedback()
    const element =`
     <li  class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`

    messageContainer.innerHTML += element
})

function clearfeedback(){

    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}