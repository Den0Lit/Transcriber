// // Слушаем сообщения от страниц
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'getCurrentTab') {
//       // Выполняем chrome.tabs.query()
//       chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//         const tab = tabs[0];
//         sendResponse({ tab });
//       });
//       return true; // Важно вернуть true для асинхронного ответа
//     }
//   });