const express = require('express');
const puppeteer = require('puppeteer');
const ScrapedData = require('../models/ScrapedData');

const router = express.Router();

// Route to render the homepage
router.get('/', (req, res) => {
    res.render('index');
});

// Route to handle the scraping process
router.post('/scrape', async (req, res) => {
    const { url } = req.body;

    try {
        // Launch Puppeteer browser
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Example: Simulate typing into a form field
        await page.waitForSelector('input#myInputField');  // Wait for the input field to be available
        await page.type('input#myInputField', 'Some text');  // Simulate typing 'Some text' into the input field with id="myInputField"

        // Example: Simulate clicking a submit button
        await page.waitForSelector('button#submitButton');  // Wait for the submit button to be available
        await page.click('button#submitButton');  // Simulate a click on the submit button with id="submitButton"

        // Wait for any resulting changes in the page after the form submission
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Scrape the data after the interaction
        const scrapedData = await page.evaluate(() => {
            const title = document.querySelector('title')?.innerText || '';
            const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
            const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.innerText);

            return { title, links, images, headings };
        });

        // Close the browser
        await browser.close();

        // Check if the data already exists in the database
        const existingData = await ScrapedData.findOne({ url: url });

        if (!existingData) {
            // Save the scraped data if it's not a duplicate
            const newScrapedData = new ScrapedData({ ...scrapedData, url });
            await newScrapedData.save();
        } else {
            // If the data exists, update it with the latest scraped content
            existingData.title = scrapedData.title;
            existingData.links = scrapedData.links;
            existingData.images = scrapedData.images;
            existingData.headings = scrapedData.headings;
            await existingData.save();
        }

        // Render the scraped data page, showing the user the data regardless of whether it was saved
        res.render('scrapedData', { scrapedData: existingData || scrapedData });

    } catch (error) {
        console.error(`Error fetching the webpage: ${error.message}`);
        res.render('index', { error: 'Failed to scrape the webpage. Please check the URL and try again.' });
    }
});

// Export the router to use in app.js
module.exports = router;
