const input = document.querySelector('#message-input')
const sendBtn = document.querySelector('#send-button')
const messageArea = document.querySelector('.message-area')

function sendMessage() {
    const text = input.value.trim()
    if (!text) return

    const bubble = document.createElement('div')
    bubble.className = 'my-message'
    bubble.innerHTML = `
        <p>${text}</p>
        <span>${new Date().toLocaleTimeString()}</span>
    `

    messageArea.appendChild(bubble)
    input.value = ''
    bubble.scrollIntoView()
}

sendBtn.addEventListener('click', sendMessage)

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage()
})