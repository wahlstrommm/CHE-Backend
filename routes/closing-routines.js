var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get('/', function(req, res, next) {
    var today = new Date();
    var fileName = today.toISOString().split('T')[0] +"-closing"+ ".json";
    
    // Ange sökvägen till mappen "closing"
    var closingFolderPath = path.join(__dirname, '..', 'routines', 'closing');
    var closingFilePath = path.join(closingFolderPath, fileName);

    // Kontrollera om filen för dagens datum finns i "closing"
    if (fs.existsSync(closingFilePath)) {
        // Läs innehållet från den befintliga filen i "closing"
        var fileContent = fs.readFileSync(closingFilePath, 'utf-8');
        try {
            // Försök att konvertera filens innehåll till ett JSON-objekt
            var jsonData = JSON.parse(fileContent);
            res.json(jsonData);
        } catch (error) {
            console.log('Error parsing file content', error);
            res.status(500).json({ error: 'Failed to parse file content' });
        }
    } else {
        // Filen för dagens datum finns inte i "closing", hämta från "template"
        var templateFilePath = path.join(__dirname, '..', 'routines', 'template', fileName);
        
        if (fs.existsSync(templateFilePath)) {
            // Läs innehållet från den befintliga filen i "template"
            var templateFileContent = fs.readFileSync(templateFilePath, 'utf-8');
            try {
                // Försök att konvertera filens innehåll till ett JSON-objekt
                var templateJsonData = JSON.parse(templateFileContent);
                res.json(templateJsonData);
            } catch (error) {
                console.log('Error parsing template file content', error);
                res.status(500).json({ error: 'Failed to parse template file content' });
            }
        } else {
            // Filen för dagens datum finns inte i "template" heller, skicka innehållet från closing.json
            res.json(require("../routines/template/closing.json"));

        }
    }
});

router.post('/', function(req, res, next) {
    var fillen = req.body;
    
    // Skapa ett Date-objekt för dagens datum
    var today = new Date();
    
    // Skapa ett filnamn med dagens datum
    var fileName = today.toISOString().split('T')[0] +"-closing" +".json";

    // Ange sökvägen till mappen "closing"
    var closingFolderPath = path.join(__dirname, '..', 'routines', 'closing');
    var closingFilePath = path.join(closingFolderPath, fileName);

    // Kontrollera om filen redan finns i "closing"
    if (fs.existsSync(closingFilePath)) {
        // Läs in den befintliga filens data i "closing"
        var existingData = fs.readFileSync(closingFilePath, 'utf-8');
        
        try {
            // Försök att konvertera den befintliga datan till ett JSON-objekt
            var existingJson = JSON.parse(existingData);
            
            // Lägg till den nya informationen till den befintliga datan
            Object.assign(existingJson, fillen);

            // Konvertera tillbaka till JSON-sträng
            const updatedJsonString = JSON.stringify(existingJson);

            // Skriv till filen i "closing"
            fs.writeFile(closingFilePath, updatedJsonString, err => {
                if (err) {
                    console.log('Error updating file', err);
                    res.status(500).json({ error: 'Failed to update file' });
                } else {
                    console.log('Successfully updated file:', closingFilePath);
                    res.status(200).json({ success: true });
                }
            });
        } catch (error) {
            console.log('Error parsing existing file data', error);
            res.status(500).json({ error: 'Failed to parse existing file data' });
        }
    } else {
        // Filen finns inte i "closing", så kolla i "template"
        var templateFilePath = path.join(__dirname, '..', 'routines', 'template', fileName);

        if (fs.existsSync(templateFilePath)) {
            // Läs in den befintliga filens data i "template"
            var templateExistingData = fs.readFileSync(templateFilePath, 'utf-8');

            try {
                // Försök att konvertera den befintliga datan till ett JSON-objekt
                var templateExistingJson = JSON.parse(templateExistingData);

                // Lägg till den nya informationen till den befintliga datan
                Object.assign(templateExistingJson, fillen);

                // Konvertera tillbaka till JSON-sträng
                const templateUpdatedJsonString = JSON.stringify(templateExistingJson);

                // Skriv till filen i "template"
                fs.writeFile(templateFilePath, templateUpdatedJsonString, err => {
                    if (err) {
                        console.log('Error updating template file', err);
                        res.status(500).json({ error: 'Failed to update template file' });
                    } else {
                        console.log('Successfully updated template file:', templateFilePath);
                        res.status(200).json({ success: true });
                    }
                });
            } catch (error) {
                console.log('Error parsing template existing file data', error);
                res.status(500).json({ error: 'Failed to parse template existing file data' });
            }
        } else {
            // Filen finns inte i "template" heller, skapa en ny fil i "closing"
            const jsonString = JSON.stringify(fillen);
            fs.writeFile(closingFilePath, jsonString, err => {
                if (err) {
                    console.log('Error writing file', err);
                    res.status(500).json({ error: 'Failed to write file' });
                } else {
                    console.log('Successfully wrote new file:', closingFilePath);
                    res.status(200).json({ success: true });
                }
            });
        }
    }
});

module.exports = router;
