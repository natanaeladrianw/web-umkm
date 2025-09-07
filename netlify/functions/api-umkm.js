const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dataPath = path.join(__dirname, 'data', 'umkm-data.json');
    const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load data' }),
    };
  }
};


