import React, { useState, useRef, useCallback } from 'react';
import { extractTextFromFile } from '../services/fileParser';
import { UploadCloudIcon, FileIcon } from './icons/Icons';
import { PRIMARY_BLUE } from '../constants';
import Loader from './Loader';

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
  onError: (message: string) => void;
  onRemoveFile: () => void;
  fileName: string | null;
}

const ACCEPTED_FILES = ".pdf,.txt";
const ACCEPTED_MIME_TYPES = ["application/pdf", "text/plain"];


const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onError, onRemoveFile, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingFileName, setParsingFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file) return;

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      onError(`File type not supported. Please upload a PDF or TXT file.`);
      return;
    }
    
    setIsParsing(true);
    setParsingFileName(file.name);
    onError(''); // Clear previous errors

    try {
      const text = await extractTextFromFile(file);
      onFileProcessed(text, file.name);
    } catch (err) {
      console.error("File parsing error:", err);
      const errorMessage = err instanceof Error ? err.message : "Sorry, we couldn't read the content of your file.";
      onError(errorMessage);
      onRemoveFile();
    } finally {
      setIsParsing(false);
      setParsingFileName(null);
    }
  }, [onError, onFileProcessed, onRemoveFile]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset the input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveClick = () => {
    onRemoveFile();
  }

  const triggerFileSelect = () => fileInputRef.current?.click();

  if (isParsing) {
      return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analyzing your document...
            </label>
            <div className="w-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[148px]">
                <div className="inline-flex items-center text-gray-600">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{color: PRIMARY_BLUE}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Extracting text from your CV, please wait...</span>
                </div>
                {parsingFileName && (
                    <p className="text-sm text-gray-500 mt-2 truncate max-w-xs" title={parsingFileName}>
                        {parsingFileName}
                    </p>
                )}
            </div>
          </div>
      );
  }

  if (fileName) {
      return (
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your CV
              </label>
              <div className="flex items-center justify-between w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                      <div className="text-gray-500"><FileIcon /></div>
                      <span className="font-medium text-gray-800">{fileName}</span>
                  </div>
                  <button onClick={handleRemoveClick} className="text-sm font-semibold text-red-600 hover:text-red-800">
                      Remove
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Your CV
      </label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 
          ${isDragging ? `border-[${PRIMARY_BLUE}] bg-blue-50` : 'border-gray-300 hover:border-gray-400'}`}
          style={{borderColor: isDragging ? PRIMARY_BLUE : undefined}}
      >
        <div className="text-gray-500 mb-2">
            <UploadCloudIcon />
        </div>
        <p className="mb-2 text-sm text-gray-500 text-center">
          <span className="font-semibold" style={{color: PRIMARY_BLUE}}>Click to upload</span> or drag and drop
        </p>
        <div className="mt-3 flex space-x-2">
          <span className="text-xs font-medium bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">PDF</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full border border-gray-200">TXT</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={ACCEPTED_FILES}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;