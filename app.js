/* =========================================
   CONFIGURATION SECTION
   Modify this section to change content
   ========================================= */
const appConfig = {
    appName: "MPS Exam Prep",
    menuTitle: "Selectează un capitol",

    dataFile: "data/data.json"
};


/* =========================================
   APPLICATION LOGIC
   ========================================= */

let currentData = [];
let currentIndex = 0;

// Initialize App on Load
document.addEventListener('DOMContentLoaded', async () => {
    // Set Titles
    document.title = appConfig.appName;
    document.getElementById('app-logo').innerText = appConfig.appName;

    // Load all questions immediately
    try {
        const response = await fetch(appConfig.dataFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        currentData = data.questions;
        startQuiz(`${appConfig.appName} - All Questions`);
    } catch (e) {
        alert("Error loading data. Ensure local server is running.");
        console.error(e);
    }
});

function showMenu() {
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    document.getElementById('menu-view').classList.remove('hidden');
}

// Quiz Logic
function startQuiz(quizTitle) {
    document.getElementById("quiz-title").innerText = quizTitle;

    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    
    currentData.forEach((q, index) => {
        const html = `
            <div class="quiz-item" id="q-${index}">
                <p><strong>${index + 1}. ${q.question}</strong></p>
                <div class="options">
                    ${q.options.map((opt) => `
                        <label>
                            <input type="radio" name="q${index}" value="${opt}">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
                <p class="feedback hidden"></p>
            </div>
        `;
        container.innerHTML += html;
    });

    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    document.getElementById('quiz-view').classList.remove('hidden');
    
    // Store correct answers for checking later
    window.quizAnswers = currentData.map(q => q.correctAnswer);
}

function submitQuiz() {
    let score = 0;
    const questions = document.querySelectorAll('.quiz-item');
    
    questions.forEach((item, index) => {
        const selected = item.querySelector(`input[name="q${index}"]:checked`);
        const feedback = item.querySelector('.feedback');
        const correctAnswers = window.quizAnswers[index];
        
        feedback.classList.remove('hidden');
        feedback.className = 'feedback'; // Reset classes
        
        // Handle both single and multiple correct answers
        const correctArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
        
        if (selected && correctArray.includes(selected.value)) {
            score++;
            feedback.innerHTML = `<span class="correct">✓ Correct</span>`;
        } else {
            const correctStr = correctArray.join(" / ");
            feedback.innerHTML = `<span class="wrong">✗ Wrong</span> (Correct: ${correctStr})`;
        }
    });
    
    document.getElementById('score-display').innerText = `Score: ${score} / ${questions.length}`;
    window.scrollTo(0, 0);
}
