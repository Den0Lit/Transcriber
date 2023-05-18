let socket

chrome.storage.local.set({ transcript: '' })

let apiKey
chrome.storage.local.get('key', ({ key }) => apiKey = key)

navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(stream => {
    if(!apiKey) return alert('Пожалуйста, установите ключ API Deepgram в специальном поле.')
    if(stream.getAudioTracks().length == 0) return alert('Вы должны поделиться всем экраном и отметить галочкой "Предоставить доступ к аудио в системе". Обновите страницу.')
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

    socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', apiKey])

    recorder.addEventListener('dataavailable', evt => {
        if(evt.data.size > 0 && socket.readyState == 1) socket.send(evt.data)
    })

    socket.onopen = () => { recorder.start(250) }

    socket.onmessage = msg => {
        const { transcript } = JSON.parse(msg.data).channel.alternatives[0]
        if(transcript) {
            console.log(transcript)
            chrome.storage.local.get('transcript', data => {
                chrome.storage.local.set({ transcript: data.transcript += ' ' + transcript })
                chrome.runtime.sendMessage({ message: 'transcriptavailable' }).catch(err => ({}))
            })
        }
    }
})

// chrome.runtime.onMessage.addListener(({ message }) => {
//     if(message == 'stop') {
//         socket.close()
//         alert('Transcription ended')
//     }
// })