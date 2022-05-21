const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const msg = {
  welcome: 'Welcome! You can write here\n',
  goodbye: 'Writing is over. Goodbye!',
  error: 'Oops! Something went wrong. Exit with code: '
};

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const rl = readline.createInterface(stdin, stdout);
const ws = fs.createWriteStream(filePath);

const shouldClose = (line) => /^exit$/.test(line);
const handleClose = () => rl.close();
const handleWrite = (line) => ws.write(line + '\n', (e) => {if (e) throw e; });

rl.write(msg.welcome);
rl.on('SIGINT', handleClose);
rl.on('line', (l) => shouldClose(l) ? handleClose() : handleWrite(l));

const handleExit = (c) => stdout.write((c === 0) ? msg.goodbye : msg.error + c);
process.on('exit', handleExit);
