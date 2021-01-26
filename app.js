const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
var files = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));

//MULTER CONFIG: to get file pdf's to temp server storage
const multerConfig = {

    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function (req, file, next) {
            next(null, './public/pdf-storage');
        },

        //Then give the file a unique name
        filename: function (req, file, next) {
            const ext = file.mimetype.split('/')[1];
            files.push(file.originalname);
            next(null, file.originalname);
        }
    }),

    //A means of ensuring only images are uploaded. 
    fileFilter: function (req, file, next) {
        console.log('asda', file);
        if (!file) {
            next();
        }
        const image = file.mimetype.startsWith('application/pdf');
        if (image) {
            console.log('PDF uploaded');
            next(null, true);
        } else {
            console.log("file not supported");

            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};

app.post('/upload', multer(multerConfig).single('pdf'), function (req, res) {
    console.log('pdffff');
    res.sendFile(__dirname + '/public' + '/' + 'index.html');
});

app.post('/fetchpdf', function (req, res) {
    console.log('fetch pdf', files[0]);
    console.log('files', files);
    res.sendFile(__dirname + '/public/pdf-storage' + '/' + files[files.length - 1]);
});
app.listen(3000, () => {
    console.log('Server started at port 3000');
})