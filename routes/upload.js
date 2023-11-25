var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ange sökvägen till "template"-mappen
var templateFolderPath = path.join(__dirname, '..', 'routines', 'template');

// Lista över tillåtna filnamn
var allowedFileNames = ['closing.json', 'todo.json']; // Uppdatera med de filnamn du tillåter

// Skapa "template"-mappen om den inte redan finns
if (!fs.existsSync(templateFolderPath)) {
    fs.mkdirSync(templateFolderPath);
}

// Konfigurera multer för att lagra uppladdade filer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, templateFolderPath);
    },
    filename: function (req, file, cb) {
        // Använd det ursprungliga filnamnet från den uppladdade filen
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

// POST-rout för att ladda upp rutiner till "template"-mappen
router.post('/', upload.single('routineFile'), function(req, res, next) {
    console.log('Upload route called');

    try {
        // Hämta filnamnet från uppladdade filen
        var fileName = req.file.originalname;
        console.log("Filnamn", fileName);

        // Kontrollera om filen är tillåten
        if (!allowedFileNames.includes(fileName)) {
            // Om filen inte är tillåten, skicka ett felmeddelande
            console.log('File not allowed');
            return res.status(400).json({ error: 'File not allowed', fileName: fileName });
        }

        // Konstruera sökvägen till den befintliga filen i "template"-mappen
        var filePath = path.join(templateFolderPath, fileName);

        // Kontrollera om filen redan finns bland de befintliga filerna
        var existingFiles = fs.readdirSync(templateFolderPath);
        console.log('Files in template folder:', existingFiles);

        if (existingFiles.includes(fileName)) {
            // Filen finns redan bland de befintliga filerna, läs innehållet och ersätt det
            var newFileContent = fs.readFileSync(req.file.path, 'utf-8');
            fs.writeFileSync(filePath, newFileContent);
            console.log('File replaced successfully');
            return res.json({ success: true, message: 'File replaced successfully', fileName: fileName });
        } else {
            // Filen finns inte bland de befintliga filerna, skicka ett meddelande
            console.log('File does not exist, not replacing');
            if (existingFiles.includes(fileName)) {
                // Ta bort filen här
                fs.unlinkSync(path.join(templateFolderPath, fileName));
                console.log('File deleted successfully');
                return res.status(400).json({ error: 'File does not exist, not replacing', fileName: fileName });
            } else {
                // Här bör du bara skicka ett felmeddelande, ingen ytterligare åtgärd behövs
                return res.status(400).json({ error: 'File does not exist, not replacing', fileName: fileName });
            }
        }
    } catch (error) {
        console.log('Error handling upload', error.message);
        res.status(500).json({ error: 'Failed to handle upload', details: error.message });
    }
});

module.exports = router;
