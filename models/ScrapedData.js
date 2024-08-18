const mongoose = require('mongoose');

const scrapedDataSchema = new mongoose.Schema({
    title: String,
    url: String,
    description: String,  // Meta description
    keywords: [String],   // Meta keywords
    author: String,       // Meta author
    links: [String],
    images: [String],
    headings: [String],
    paragraphs: [String], // Paragraph content
    videos: [String],     // Video links
    tables: [{
        headers: [String],  // Table headers
        rows: [[String]]    // Table rows
    }],
    breadcrumbs: [String], // Breadcrumb navigation
    productDetails: {      // E-commerce specific details
        name: String,
        price: String,
        availability: String,
        rating: String
    },
    dateScraped: { type: Date, default: Date.now }
});

const ScrapedData = mongoose.model('ScrapedData', scrapedDataSchema);

module.exports = ScrapedData;
