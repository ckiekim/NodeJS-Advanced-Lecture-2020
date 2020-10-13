const crypto = require('crypto');

// SHA: Secure Hash Algorithm
let shasum = crypto.createHash('sha256');   // sha256, sha512
shasum.update('password');
let output = shasum.digest('base64');  // hex, base64

console.log('password:', output);
console.log(output.length);
