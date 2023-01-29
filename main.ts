import { start } from './repl/repl.ts';

console.log('This is the Monkey programming language!\n');
const input = prompt('Feel free to type in commands\n');
start(input);
