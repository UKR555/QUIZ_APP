"use client";
import { useState, ChangeEvent, FormEvent } from 'react';

interface QuizFormProps {
  onSubmit: (question: string, ocrText: string) => void;
  answer: string;
  isLoading: boolean;
}

export default function QuizForm({ onSubmit, answer, isLoading }: QuizFormProps) {
  const [question, setQuestion] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleOcrTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setOcrText(e.target.value);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview for the uploaded image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setIsProcessingImage(true);
    
    try {
      // Call our OCR API endpoint
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOcrText(data.text);
    } catch (error) {
      console.error('Error processing image:', error);
      setOcrText('Error processing image. Please try again or manually type your question.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text') {
      onSubmit(question, '');
    } else {
      onSubmit('', ocrText);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Enter Quiz Question</h2>
      <p className="text-gray-400 mb-4">Paste your question or upload an image.</p>
      
      <div className="flex mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 ${activeTab === 'text' ? 'text-white border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Text Question
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 ${activeTab === 'image' ? 'text-white border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Upload Image
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {activeTab === 'text' ? (
          <div className="mb-4">
            <textarea
              value={question}
              onChange={handleQuestionChange}
              className="w-full bg-gray-700 text-white p-4 rounded-md min-h-[100px]"
              placeholder="Paste your question here..."
            />
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <label className="bg-gray-700 text-gray-300 w-full py-2 px-4 rounded-md text-center cursor-pointer hover:bg-gray-600 transition">
                Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={isProcessingImage}
                />
              </label>
              
              {isProcessingImage && (
                <div className="text-center text-gray-300">
                  <p>Processing image...</p>
                </div>
              )}
              
              {imagePreview && (
                <div className="w-full max-w-sm mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded question" 
                    className="w-full h-auto rounded-md"
                  />
                </div>
              )}
            </div>
            
            <textarea
              value={ocrText}
              onChange={handleOcrTextChange}
              className="w-full bg-gray-700 text-white p-4 rounded-md min-h-[100px]"
              placeholder="Extracted text will appear here. You can also paste text directly."
              disabled={isProcessingImage}
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || isProcessingImage || (activeTab === 'text' && !question.trim()) || (activeTab === 'image' && !ocrText.trim())}
          className="w-full bg-primary text-black font-semibold py-3 rounded-md hover:opacity-90 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Answer'}
        </button>
      </form>
      
      {answer && (
        <div className="mt-4 bg-gray-700 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Answer:</h3>
          <div className="text-gray-200 whitespace-pre-line">{answer}</div>
        </div>
      )}
    </div>
  );
} 