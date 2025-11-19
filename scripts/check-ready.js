const http = require('http');
const fs = require('fs');
const path = require('path');

const checkUrl = (url) => {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            resolve(res.statusCode);
        }).on('error', () => resolve(500));
    });
};

const runChecks = async () => {
    console.log('Running acceptance checks...');
    let passed = true;

    // Check Landing Page
    const landingStatus = await checkUrl('http://localhost:3000/');
    if (landingStatus === 200) console.log('✅ Landing page accessible');
    else { console.log('❌ Landing page failed'); passed = false; }

    // Check QR Code API
    const qrStatus = await checkUrl('http://localhost:3000/api/qrcode');
    if (qrStatus === 200) console.log('✅ QR Code API accessible');
    else { console.log('❌ QR Code API failed'); passed = false; }

    // Check Public QR File
    const qrPath = path.join(__dirname, '..', 'public', 'scankart_qr.png');
    if (fs.existsSync(qrPath)) console.log('✅ Public QR file exists');
    else { console.log('❌ Public QR file missing (will be generated on first API hit)'); }

    if (passed) console.log('\nAll basic checks passed! 🚀');
    else console.log('\nSome checks failed.');
};

// Wait for server to start
setTimeout(runChecks, 5000);
