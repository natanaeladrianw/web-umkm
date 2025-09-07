const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dataPath = path.join(__dirname, 'data', 'umkm-data.json');
    const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const products = json.umkm && json.umkm.products ? json.umkm.products : [];
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load products' }),
    };
  }
};


