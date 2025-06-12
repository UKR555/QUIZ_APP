"use client";
import { useState } from 'react';
import QuizForm from '@/components/QuizForm';

export default function Home() {
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleSubmitQuestion = async (question: string, ocrText: string) => {
    setIsLoading(true);
    setDebugInfo('');
    try {
      const questionToProcess = ocrText || question;
      
      if (!questionToProcess.trim()) {
        setAnswer('Please enter a question or upload an image with text.');
        return;
      }
      
      console.log("Sending question to API:", questionToProcess);
      setDebugInfo(`Sending question: "${questionToProcess.substring(0, 30)}..."`);
      
      // Call our API endpoint to get the answer
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionToProcess }),
      });
      
      setDebugInfo(prev => `${prev}\nAPI Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setDebugInfo(prev => `${prev}\nReceived data: ${JSON.stringify(data).substring(0, 100)}...`);
      
      if (data.error) {
        setDebugInfo(prev => `${prev}\nAPI Error: ${data.error}`);
        throw new Error(data.error);
      }
      
      if (!data.answer) {
        setDebugInfo(prev => `${prev}\nNo answer in response!`);
        throw new Error("No answer received from API");
      }
      
      setAnswer(data.answer);
    } catch (error: any) {
      console.error('Error getting answer:', error);
      setAnswer(`Sorry, there was an error processing your question: ${error.message}\n\nPlease try again.`);
      setDebugInfo(prev => `${prev}\nException: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">UKRWhiz</h1>
      <p className="text-lg text-gray-300 mb-8">1,000+ quizzes to challenge you and your friends on all topics!</p>
      
      <div className="w-full max-w-lg">
        <QuizForm 
          onSubmit={handleSubmitQuestion}
          answer={answer}
          isLoading={isLoading}
        />
        
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-900 text-xs text-gray-400 rounded-md whitespace-pre-line">
            <div className="font-bold mb-1">Debug Info:</div>
            {debugInfo}
          </div>
        )}
      </div>
    </main>
  );
} 