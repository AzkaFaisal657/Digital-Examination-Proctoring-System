try {
  const attempts = require('c:\\Users\\fazia\\Desktop\\Digital Examination & Proctoring System\\backend\\routes\\attempts.js');
  console.log('Module loaded successfully');
  console.log('Keys:', Object.keys(attempts));
} catch (e) {
  console.error('Error loading module:', e.message);
  console.error('Stack:', e.stack);
}
