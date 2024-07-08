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
        while (true) {
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
    const mainEl = document.querySelector('#main')
    const textareaEl = mainEl.querySelector('div[contenteditable="true"]')

    if (!textareaEl) {
        throw new Error('There is no opened conversation')
    }

    textareaEl.focus()
    document.execCommand('insertText', false, text)
    textareaEl.dispatchEvent(new Event('change', { bubbles: true }))

    setTimeout(() => {
        (mainEl.querySelector('[data-testid="send"]') || mainEl.querySelector('[data-icon="send"]')).click()
    }, 100)
}
