# Word Management Chrome Extension

This Chrome extension allows users to manage a list of words, save them to local storage, and send them to a webpage input field.

## Features

- **Add Word**: Add new words to the list.
- **Remove Word**: Delete words from the list.
- **Edit Word**: Modify existing words in the list.
- **Save Words**: Save the word list to local storage.
- **Load Words**: Load the word list from local storage.
- **Send Word**: Send words to a webpage input field.
- **Test**: Automatically send all words from the list to the input field with a delay between each.

## Installation

1. Clone the repository or download the zip file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch.
4. Click on "Load unpacked" and select the directory containing this extension's files.

## Usage

### Adding Words

1. Enter a word in the input field provided.
2. Click the "Add Word" button to add it to the list.

### Removing Words

1. Click the trash icon next to the word you want to remove.

### Editing Words

1. Edit the word directly in the input field in the list.

### Saving and Loading Words

- Words are automatically saved to local storage whenever they are added, edited, or removed.
- When the extension is loaded, words are automatically retrieved from local storage.

### Sending Words

1. Enter a word in the input field.
2. Click the "Send Word" button to send it to the active tab's input field.
3. Click the "Test" button to send all words from the list to the active tab's input field, one by one, with a delay between each word.

### Resetting Storage

1. Click the "Reset Storage" button to reset the storage in the active tab.

## Functions

### `sendWord()`

Sends the word from the input field to the active tab.

### `addWord()`

Adds a word from the input field to the list and saves it to local storage.

### `removeWord(index)`

Removes a word from the list by its index and updates local storage.

### `editWord(index, newWord)`

Edits a word in the list by its index and updates local storage.

### `updateWordList()`

Updates the displayed list of words.

### `saveWords()`

Saves the current list of words to local storage.

### `loadWords()`

Loads the list of words from local storage.

### `insertAndSend(text)`

Inserts text into an input field on the active tab and simulates typing.

## Event Listeners

- **DOMContentLoaded**: Loads words from local storage and sets up event listeners for buttons and forms.
- **click**: Handles clicks on buttons to add words, send words, reset storage, and test sending words.
- **submit**: Handles form submission to send a word.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
