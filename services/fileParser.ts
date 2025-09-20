import * as pdfjsLib from 'pdfjs-dist';

// Set up the PDF.js worker
// This is necessary for pdf.js to work in a web environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // Check if the file has actual content, not just whitespace
            if (text && text.trim().length > 0) {
                resolve(text);
            } else {
                reject(new Error("The TXT file appears to be empty. Please upload a file with content."));
            }
        };
        reader.onerror = () => {
            reject(new Error("Failed to read the TXT file. It might be corrupted."));
        };
        reader.readAsText(file);
    });
};

const readPdfFile = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
            throw new Error("The PDF file appears to be empty.");
        }
        
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
        }

        if (textContent.trim().length > 0) {
            return textContent;
        } else {
            throw new Error("Could not extract any text from the PDF. It might contain only images or be empty.");
        }
    } catch (error: any) {
        console.error("PDF parsing error:", error);
        // Re-throw our specific, user-friendly errors
        if (error.message.includes("empty") || error.message.includes("extract any text")) {
            throw error;
        }
        // For other errors from pdf.js (like corruption), provide a general message.
        throw new Error("Could not read the PDF file. It might be corrupted or in an unsupported format.");
    }
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    switch (file.type) {
        case 'text/plain':
            return readTextFile(file);
        case 'application/pdf':
            return readPdfFile(file);
        default:
            throw new Error('Unsupported file type');
    }
};