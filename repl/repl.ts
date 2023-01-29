import { Lexer } from '../lexer/lexer.ts';
import { token } from '../token/token.ts';

type StdIn = string | null;

export const start = (input: StdIn) => {
  if (!input) return;
  const l = new Lexer({ input });
  while (l.ch !== token.EOF) {
    const tok = l.nextToken();
    console.log(tok);
  }
};
