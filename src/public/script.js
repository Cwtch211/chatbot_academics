document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-btn');
    const voiceButton = document.querySelector('.voice-btn');

    // Initial greeting
    setTimeout(() => {
        addMessage("Welcome to Rapt! How can I assist you with your academic needs?", 'bot');
        
        // Add buttons as part of the conversation
        setTimeout(() => {
            const buttonHtml = `
                <div class="button-container">
                    <button class="response-button" onclick="window.open('https://vtu.ac.in/b-e-scheme-syllabus/',)">Syllabus</button>
                    <button class="response-button" onclick="window.open('https://vtu.ac.in/category/examination/', )">Notification</button>
                    <button class="response-button" onclick="window.open('https://vtu.ac.in/en/category/examination/time-table/', )">Exam Schedule</button>
                    <button class="response-button" onclick="window.open('https://vviet.dhi-edu.com',)">Attendance Status</button>
                    <button class="response-button" onclick="window.open('https://vtu.ac.in/wp-content/uploads/2022/05/Guidelines.pdf',)">Policies and Guidelines</button>
                    <button class="response-button" onclick="window.open('https://github.com/The-Cool-Coders/Project-Ideas-And-Resources',)">Projects & Internships</button>
                </div>
            `;
            addMessage(buttonHtml, 'bot'); // Add buttons below the greeting
        }, 2000);
    }, 1000);

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        
        // Use innerHTML to allow HTML content
        messageDiv.innerHTML = text; // Change from textContent to innerHTML
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showThinking() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.classList.add('thinking');
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            thinkingDiv.appendChild(dot);
        }
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return thinkingDiv;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';
            
            const thinkingDiv = showThinking();
            
            // Send the message to the server
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            })
            .then(response => response.json())
            .then(data => {
                thinkingDiv.remove();
                addMessage(data.response, 'bot'); // Use the response from the server
            })
            .catch(error => {
                thinkingDiv.remove();
                addMessage("Sorry, there was an error processing your request.", 'bot');
                console.error('Error:', error);
            });
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    voiceButton.addEventListener('click', () => {
        // Add voice recognition functionality here
        alert('Voice recognition feature coming soon!');
    });
}); 