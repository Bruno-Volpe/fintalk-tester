const words = [];

// Carrega palavras do localStorage quando o conteúdo é carregado
document.addEventListener('DOMContentLoaded', () => {
    loadWords();

    document.getElementById('resetStorage').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: insertAndSend,
                args: ["/resetStorage"]
            });
        });
    });

    document.getElementById('sendWord').addEventListener('click', async () => {
        sendWord();
    });

    document.getElementById('test').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        for (const text of words) {
            await new Promise(resolve => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: insertAndSend,
                    args: [text]
                }, resolve);
            });
            await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 2 segundos antes de enviar a próxima palavra
        }
    });

    document.getElementById('addWord').addEventListener('click', () => {
        addWord();
    });

    document.getElementById('wordForm').addEventListener('submit', (event) => {
        event.preventDefault();
        sendWord()
    });
});

async function sendWord() {
    const wordInput = document.getElementById('wordInput');
    const text = wordInput.value;
    if (text) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: insertAndSend,
            args: [text]
        });
    }
}

function addWord() {
    const wordInput = document.getElementById('wordInput');
    if (wordInput.value) {
        words.push(wordInput.value);
        saveWords();
        updateWordList();
        wordInput.value = ''; // Clear input after adding the word
    }
}

function removeWord(index) {
    words.splice(index, 1);
    saveWords();
    updateWordList();
}

function editWord(index, newWord) {
    words[index] = newWord;
    saveWords();
}

function updateWordList() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';
    words.forEach((word, index) => {
        const wordElement = document.createElement('div');
        wordElement.className = 'd-flex align-items-center p-2 word-item';
        wordElement.innerHTML = `
            <input type="text" value="${word}" class="form-control mr-2 word-input mx-auto" />
            <img id="delete" src="./Trash.png" alt="trash" class="img-fluid ml-2" width="18" />
        `;
        wordElement.querySelector('#delete').addEventListener('click', () => {
            removeWord(index);
        });
        wordElement.querySelector('.word-input').addEventListener('input', (event) => {
            editWord(index, event.target.value);
        });
        wordList.appendChild(wordElement);
    });
}

function saveWords() {
    localStorage.setItem('words', JSON.stringify(words));
}

function loadWords() {
    const storedWords = localStorage.getItem('words');
    if (storedWords) {
        const parsedWords = JSON.parse(storedWords);
        words.push(...parsedWords);
        updateWordList();
    }
}

function insertAndSend(text) {
    return new Promise((resolve) => {
        function typeText(input, text, callBackFn) {
            let index = 0;

            function typeNextCharacter() {
                if (index < text.length) {
                    const char = text[index];
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(input, input.value + char);

                    const keyDownEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
                    const keyPressEvent = new KeyboardEvent('keypress', { key: char, bubbles: true });
                    const inputEvent = new Event('input', { bubbles: true });
                    const keyUpEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });

                    input.dispatchEvent(keyDownEvent);
                    input.dispatchEvent(keyPressEvent);
                    input.dispatchEvent(inputEvent);
                    input.dispatchEvent(keyUpEvent);

                    index++;
                    setTimeout(typeNextCharacter, 100); // Ajuste o intervalo de tempo conforme necessário
                } else {
                    callBackFn();
                }
            }

            typeNextCharacter();
        }

        const input = document.querySelector("#root > div.appcontainer > div.footer-bar > form > div.conversation-container > input");
        if (input) {
            typeText(input, text, () => {
                const sendButton = document.querySelector("#root > div.appcontainer > div.footer-bar > form > button > div");
                if (sendButton) {
                    sendButton.click();
                    resolve();
                }
            });
        }
    });
}
