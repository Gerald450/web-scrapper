const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const scraperRoutes = require('./routes/scraper');

const app = express();


uri = process.env.MONGO_URI;
mongoose.connect(uri);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine', 'ejs');


app.use('/', scraperRoutes);  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
