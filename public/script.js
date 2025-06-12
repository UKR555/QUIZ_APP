document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const textTab = document.getElementById('text-tab');
  const imageTab = document.getElementById('image-tab');
  const textInputContainer = document.getElementById('text-input-container');
  const imageInputContainer = document.getElementById('image-input-container');
  const questionForm = document.getElementById('question-form');
  const questionInput = document.getElementById('question-input');
  const ocrInput = document.getElementById('ocr-input');
  const imageUpload = document.getElementById('image-upload');
  const submitBtn = document.getElementById('submit-btn');
  const answerContainer = document.getElementById('answer-container');
  const answerText = document.getElementById('answer-text');

  // Tab switching functionality
  textTab.addEventListener('click', () => {
    textTab.classList.add('active');
    imageTab.classList.remove('active');
    textInputContainer.classList.add('active');
    imageInputContainer.classList.remove('active');
  });

  imageTab.addEventListener('click', () => {
    imageTab.classList.add('active');
    textTab.classList.remove('active');
    imageInputContainer.classList.add('active');
    textInputContainer.classList.remove('active');
  });

  // Image upload handler
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, this would process the image and extract text using OCR
      // For this demo, we'll simply simulate it with a placeholder message
      ocrInput.value = "This text would be extracted from your uploaded image using OCR technology.";
    }
  });

  // Form submission handler
  questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get the active tab's input
    const activeTab = textTab.classList.contains('active') ? 'text' : 'image';
    const question = activeTab === 'text' ? questionInput.value.trim() : ocrInput.value.trim();
    
    if (!question) {
      alert('Please enter a question or upload an image');
      return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Call the API to get answer from OpenAI
    fetch('/api/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })
      .then(response => response.json())
      .then(data => {
        // Display the answer
        answerContainer.style.display = 'block';
        answerText.textContent = data.answer || 'Sorry, no answer was provided.';
        
        // Reset button state
        submitBtn.textContent = 'Answer';
        submitBtn.disabled = false;
        
        // Scroll to answer
        answerContainer.scrollIntoView({ behavior: 'smooth' });
      })
      .catch(error => {
        console.error('Error:', error);
        answerContainer.style.display = 'block';
        answerText.textContent = 'Sorry, there was an error processing your question. Please try again.';
        
        // Reset button state
        submitBtn.textContent = 'Answer';
        submitBtn.disabled = false;
      });
  });
}); 