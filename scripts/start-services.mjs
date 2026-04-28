import { spawn } from 'node:child_process';

const commands = [
  ['npm', ['run', 'start:web']],
  ['npm', ['run', 'start:api']]
];
const children = commands.map(([command, args]) =>
  spawn(command, args, { stdio: 'inherit' })
);

const stop = signal => {
  for (const child of children) {
    child.kill(signal);
  }
};

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
Promise.all(children.map(child => new Promise(resolve => child.on('exit', resolve)))).then(() => process.exit(0));
