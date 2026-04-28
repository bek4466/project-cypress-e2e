import { spawn } from 'node:child_process';

const commands = [
  // Run the static UI and mock API together so one test command boots the full stack.
  ['npm', ['run', 'start:web']],
  ['npm', ['run', 'start:api']]
];
const children = commands.map(([command, args]) =>
  spawn(command, args, { stdio: 'inherit' })
);

const stop = signal => {
  // Forward shutdown signals to child services so CI does not leave orphaned ports.
  for (const child of children) {
    child.kill(signal);
  }
};

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
Promise.all(children.map(child => new Promise(resolve => child.on('exit', resolve)))).then(() => process.exit(0));
