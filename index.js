const axios = require('axios');

async function getAndroidVersionFromGooglePlay(packageName) {
    const response = {}; // Initialize an object to store the response

    try {
        const responseFromPlayStore = await axios.get(`https://play.google.com/store/apps/details?id=${packageName}`);
        const html = responseFromPlayStore.data;

        // Look for the pattern that contains the version number
        const pattern = /,\[\[\["(\d+\.\d+.*?)"]]/;
        const matches = html.match(pattern);

        if (matches && matches.length > 1) {
            const version = matches[1];
            // Check if the found version number matches the desired format
            if (/^\d+\.\d+.*/.test(version)) {
                response.status = 'success';
                response.version = version;
            } else {
                response.status = 'error';
                response.message = 'Invalid version format';
            }
        } else {
            response.status = 'error';
            response.message = 'Version number not found';
        }
    } catch (error) {
        response.status = 'error';
        response.message = error.message;
    }

    return response;
}

// Sample usage
const express = require('express');
const app = express();
const port = 5000;

app.get('/', async (req, res) => {
    const packageName = req.query.package_name;
    if (packageName) {
        const androidVersion = await getAndroidVersionFromGooglePlay(packageName);
        res.json(androidVersion);
    } else {
        res.status(400).json({ status: 'error', message: 'Package name not provided in the query parameters.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});