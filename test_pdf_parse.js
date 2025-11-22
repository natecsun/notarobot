const fs = require('fs');
const pdf = require('pdf-parse');

console.log('pdf export:', pdf);

async function test() {
    try {
        const dataBuffer = fs.readFileSync('test_resume.pdf');
        const data = await pdf(dataBuffer);
        console.log('PDF Text:', data.text);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
