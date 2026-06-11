const { parse } = require('csv-parse');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Process a CSV file with a "url" column and create short URLs in bulk.
 * Returns the results as an array of { originalUrl, shortCode, shortUrl }.
 */
const processBulkCsv = async (buffer, userId, baseUrl) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];

    parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
      .on('data', (row) => {
        const url = row.url || row.URL || row.Url || row.link || row.Link;
        if (url) results.push(url);
      })
      .on('error', reject)
      .on('end', async () => {
        const created = [];

        for (const originalUrl of results) {
          try {
            new URL(originalUrl); // validate

            let shortCode = nanoid(6);
            while (await Url.findOne({ shortCode })) {
              shortCode = nanoid(6);
            }

            const urlDoc = await Url.create({
              userId,
              originalUrl,
              shortCode,
            });

            created.push({
              originalUrl,
              shortCode: urlDoc.shortCode,
              shortUrl: `${baseUrl}/${urlDoc.shortCode}`,
            });
          } catch (err) {
            errors.push({ originalUrl, error: 'Invalid URL format' });
          }
        }

        resolve({ created, errors, total: results.length });
      });
  });
};

module.exports = { processBulkCsv };
