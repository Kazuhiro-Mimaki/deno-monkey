import { Parser } from './parser.ts';
import { Lexer } from '../lexer/lexer.ts';
import { Statement } from '../ast/ast.ts';
import { token, keywords } from '../token/token.ts';

const testLetStatement = (s: Statement, name: string): boolean => {
  if (s.tokenLiteral() !== keywords.get(token.LET)) {
    console.error(`s.tokenLiteral not 'let'. got: ${s.tokenLiteral}`);
    return false;
  }

  if (s.name.value != name) {
    console.error(`s.name.value not ${name}. got ${s.name.value}`);
    return false;
  }

  if (s.name.tokenLiteral() != name) {
    console.error(`s.name.value not ${name}. got ${s.name.tokenLiteral()}`);
    return false;
  }

  return true;
};

Deno.test('test let statements', () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const l = new Lexer({ input });
  const p = new Parser({ l: l });

  const program = p.parseProgram();
  if (!program) {
    throw new Error('parseProgram() returned null');
  }
  if (program.statements.length !== 3) {
    throw new Error(
      `program.statements does not contain 3 statements. got: ${program.statements.length}`
    );
  }

  const tests: Array<{ expectedIdentifier: string }> = [
    { expectedIdentifier: 'x' },
    { expectedIdentifier: 'y' },
    { expectedIdentifier: 'foobar' },
  ];

  tests.forEach((test, i) => {
    const stmt = program.statements[i];
    if (!testLetStatement(stmt, test.expectedIdentifier)) {
      return;
    }
  });
});
