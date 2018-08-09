const bcrypt = require('bcrypt');
const password = process.argv[2];
const hashedPassword = bcrypt.hashSync(password, 10);

console.log(hashedPassword);