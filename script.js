const chatViewer = document.querySelector('#chatViewer');
const chatMessager = document.querySelector('#chatMessager')

chatMessager.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { 
        runViewer()
    }
});

async function runViewer(){
    chatMessager.disabled = 'true';
    const selfMessage = getSelfMessage(chatMessager);
    const answerMessage = await getAnswerMessage(selfMessage);
    chatMessager.disabled = '';
}

function showMessage(author, message, color, variety, position=null){
    const divRow = document.createElement('div');
    divRow.classList.add('row');

    const divCol = document.createElement('div');
    divCol.classList.add('col', 's12', 'm5', position);

    const divCardPanel = document.createElement('div');
    divCardPanel.classList.add('card-panel', color, variety);

    const authorSpan = document.createElement('span');
    authorSpan.classList.add('white-text');
    const strongAuthor = document.createElement('strong');
    strongAuthor.textContent = `${author}: `;
    authorSpan.appendChild(strongAuthor);

    const nextLine = document.createElement('br');

    const messageSpan= document.createElement('span');
    messageSpan.classList.add('white-text');
    messageSpan.textContent = message;

    divCardPanel.appendChild(authorSpan);
    divCardPanel.appendChild(nextLine);
    divCardPanel.appendChild(messageSpan);
    divCol.appendChild(divCardPanel);
    divRow.appendChild(divCol);
    chatViewer.appendChild(divRow);
}

function getSelfMessage(self){
    selfMessage = self.value;
    self.value = '';
    showMessage('Eu', selfMessage, 'teal', 'lighten-1', 'offset-m7');
}

async function getAnswerMessage(selfMessage) {
    const OPEN_API_KEY = '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';
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPEN_API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: selfMessage,
            max_tokens: 1500, 
            temperature: 0.1, 
        }),
    });

    const json = await response.json();

    let answerMessage = '';

    if (json.choices?.[0].text) {
        const text = json.choices[0].text || 'No answer';
        answerMessage = text;
        showMessage('GPT', answerMessage, 'grey', 'darken-3');
    } else if (json.error?.message) {
        answerMessage = json.error.message;
        showMessage('Error', answerMessage, 'red', 'darken-3');
    }

    return answerMessage;
}

