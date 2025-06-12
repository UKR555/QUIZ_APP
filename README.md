# UKRWhiz - Quiz App

A web application that provides answers to questions submitted as text or images. UKRWhiz leverages AI to provide accurate answers to a wide range of questions.

## Features

- Enter questions directly as text
- Upload images containing questions (with OCR processing)
- Get AI-powered answers to your questions
- Modern, responsive UI

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API (for AI-powered answers)

## Production Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:

```
# OpenAI API Key - Required for AI-powered answers
OPENAI_API_KEY=your_openai_api_key_here

# OCR Service API Key - Optional for image processing
OCR_API_KEY=your_ocr_api_key_here
```

4. Start the development server:

```bash
npx next dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Key Instructions

### OpenAI API Key
1. Visit [OpenAI's platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

If you don't provide an OpenAI API key, the app will still work but will return simulated answers.

### OCR API Key (Optional)
The application has built-in OCR simulation, but for production use, you can integrate with services like:
- Google Cloud Vision API
- Microsoft Azure Computer Vision
- Tesseract OCR

## Features in Production

With valid API keys configured, the application:
1. Processes uploaded images to extract text using OCR
2. Sends the extracted text to OpenAI to generate accurate answers
3. Provides a seamless experience for users asking questions via text or images

## Running in Production

For a production deployment:

```bash
npm run build
npm start
```

The app is also ready for deployment on platforms like Vercel, Netlify, or AWS.

## Implementation Notes

In a production environment, this application would integrate with:
- OpenAI or similar AI service for generating answers
- Image-to-text OCR service for extracting text from uploaded images

The current implementation includes frontend UI components and simulated responses for demonstration purposes. 