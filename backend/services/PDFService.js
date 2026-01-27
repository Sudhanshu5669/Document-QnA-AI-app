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
            .replace(/\+/g, ' ')
            .replace(/\n+/g, '/n')
            .trim();
    }

    splitTextIntoChunks(text, chunksize = 1000, overlap = 200){
        
    }


}

module.exports = new PDFService();