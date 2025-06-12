const http = require('http');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Initialize OpenAI with the API key from environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;
console.log(`OpenAI API Key exists: ${!!openaiApiKey}`);
console.log(`OpenAI API Key length: ${openaiApiKey ? openaiApiKey.length : 0}`);

let openai = null;
if (openaiApiKey) {
  try {
    openai = new OpenAI({ apiKey: openaiApiKey });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Error initializing OpenAI client:', error.message);
  }
}

// Define the directory containing our static files
const staticDir = path.join(__dirname, 'public');

// Create the public directory if it doesn't exist
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
  console.log(`Created directory: ${staticDir}`);
}

// Create a simple HTTP server
const server = http.createServer(async (req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Handle API request for answers
  if (req.method === 'POST' && req.url === '/api/answer') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { question } = JSON.parse(body);
        console.log(`Received question: ${question}`);
        
        if (!question || question.trim() === '') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Question is required' }));
          return;
        }

        if (!openai) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'OpenAI API key not configured',
            answer: `This is a simulated response since the OpenAI API key is not configured. In a production environment, this would be an AI-generated answer to: "${question}"`
          }));
          return;
        }
        
        try {
          console.log('Calling OpenAI API...');
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that provides accurate answers to questions. Be concise but thorough."
              },
              {
                role: "user",
                content: question
              }
            ],
            temperature: 0.7,
            max_tokens: 500,
          });
          
          const answer = response.choices[0].message.content;
          console.log(`OpenAI answer: ${answer.substring(0, 50)}...`);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ answer }));
          
        } catch (openaiError) {
          console.error('OpenAI API Error:', openaiError.message);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: "API error", 
            answer: `Error calling OpenAI API: ${openaiError.message}. Please check your API key and try again.`
          }));
        }
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    
    return;
  }
  
  // For the root path, serve our HTML file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        console.error(`Error loading index.html: ${err.message}`);
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      console.log('Serving index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Handle other static files
  const filePath = path.join(__dirname, req.url);
  console.log(`Attempting to serve: ${filePath}`);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    
    switch (ext) {
      case '.html':
        contentType = 'text/html';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }

    console.log(`Serving ${filePath} as ${contentType}`);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${__dirname}`);
  console.log(`Environment variables loaded from .env.local: ${!!process.env.OPENAI_API_KEY}`);
}); 