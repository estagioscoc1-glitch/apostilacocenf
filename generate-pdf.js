const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const htmlPath = path.resolve(__dirname, 'apostila.html');
  const pdfPath = path.resolve(__dirname, 'apostila.pdf');

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Loading HTML file...');
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Wait a bit for fonts to load and animations to settle
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    }
  });

  await browser.close();

  const fs = require('fs');
  const stats = fs.statSync(pdfPath);
  console.log(`PDF generated successfully: ${pdfPath}`);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
})();
