"use client";
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState<any>({
    time: new Date().toISOString(),
    nextJsVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
    windowLocation: typeof window !== 'undefined' ? window.location.href : 'unknown',
  });
  
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Fetch server info
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => {
        setServerInfo(data);
      })
      .catch(err => {
        console.error('Error fetching server info:', err);
        setServerInfo({ error: err.message });
      });
  }, []);
  
  const testOpenAI = async () => {
    setIsLoading(true);
    setTestResult('Testing OpenAI connection...');
    
    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'What is the capital of France?' }),
      });
      
      const data = await response.json();
      setTestResult(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Next.js Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Client Info</h2>
        <pre className="bg-gray-800 p-4 rounded-md overflow-auto">
          {JSON.stringify(clientInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">Server Info</h2>
        {serverInfo ? (
          <pre className="bg-gray-800 p-4 rounded-md overflow-auto">
            {JSON.stringify(serverInfo, null, 2)}
          </pre>
        ) : (
          <div>Loading server info...</div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">OpenAI API Test</h2>
        <button 
          onClick={testOpenAI}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
        </button>
        
        {testResult && (
          <pre className="mt-4 bg-gray-800 p-4 rounded-md overflow-auto">
            {testResult}
          </pre>
        )}
      </div>
      
      <div className="mt-6">
        <a href="/" className="text-blue-400 hover:underline">Back to Home</a>
      </div>
    </div>
  );
} 