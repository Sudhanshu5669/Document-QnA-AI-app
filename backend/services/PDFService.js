const pdf = require('pdf-parse')
const fs = require('fs');
const { log } = require('console');

class PDFService {
    // This will extract data from the pdf and convert it to text.
    async extractTextFromPdf(filePath){
        try{
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);

            console.log(`[PDF Service] successfully extracted ${data.numpages} from the pdf.`);

            return data.text;
        } catch(error){
            console.log("[PDF Service] failed to exttract any data due to an error: ", error);
            throw new Error('Failed to extract data from the pdf...');
        }
    }

    cleanText(text){
        return text
            .replace(/\+/g, ' ')    // Removes all unnecessary spaces in between characters or sentences
            .replace(/\n+/g, '/n')  // Removes all unnecessary new lines
            .trim();                // removes all unnecessary trailing spaces
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
    }
}

module.exports = new PDFService();