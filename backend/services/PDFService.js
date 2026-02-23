// Check if the module has a 'default' property and use it, otherwise use the module itself
const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;
const fs = require('fs');
const { log } = require('console');

class PDFService {
    // This will extract data from the pdf and convert it to text.
    async extractTextFromPdfBuffer(buffer) {
    try {
        const data = await pdfParse(buffer);
        console.log(`[PDF Service] successfully extracted ${data.numpages} pages from the pdf.`);
        return data.text;
    } catch (error) {
        console.log("[PDF Service] failed to extract any data due to an error: ", error);
        throw new Error('Failed to extract data from the pdf...');
    }
}

    cleanText(text){
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        // Replace multiple newlines (paragraphs) with a placeholder
        .replace(/\n{2,}/g, "___PARAGRAPH___")
        // Replace single newlines (line breaks) with space
        .replace(/\n/g, " ")
        // Restore paragraphs
        .replace(/___PARAGRAPH___/g, "\n\n")
        .replace(/\s+/g, ' ') 
        .trim();
}

    splitTextIntoChunks(text, chunksize = 1000, overlap = 200){
        const chunks = [];
        let startIndex = 0;

        while(startIndex < text.length){
            let endIndex = startIndex + chunksize;

            if(endIndex < text.length){
                const lastSentenceEnd = Math.max(
                    text.lastIndexOf('.', endIndex),
                    text.lastIndexOf('?', endIndex),
                    text.lastIndexOf('!', endIndex)
                )

                if(lastSentenceEnd > startIndex + chunksize/2){
                    endIndex = lastSentenceEnd + 1;
                }
            }

            const chunk = text.substring(startIndex, endIndex).trim();

            if(chunk.length > 0){
                chunks.push(chunk);
            }

            startIndex = endIndex - overlap;
        }
        return chunks;
    }
}

module.exports = new PDFService();