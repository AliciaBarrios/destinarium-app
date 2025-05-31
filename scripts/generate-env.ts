const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';
const apiKey = process.env['GOOGLE_PLACES_API_KEY'];

const content = `
export const environment = {
  production: true,
  googlePlacesApiKey: '${apiKey}'
};
`;

fs.writeFileSync(targetPath, content);
