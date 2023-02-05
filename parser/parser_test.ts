import { Parser } from './parser.ts';
import { Lexer } from '../lexer/lexer.ts';
import { LetStatement } from '../ast/ast.ts';
import { token, Token } from '../token/token.ts';

const testLetStatement = (s: LetStatement, name: string): boolean => {
  if (s.tokenLiteral() !== 'let') {
    throw new Error(`s.tokenLiteral not 'let'. got ${s.tokenLiteral()}`);
  }

  if (s.name.value != name) {
    throw new Error(`s.name.value not ${name}. got ${s.name.value}`);
  }

  if (s.name.tokenLiteral() != name) {
    throw new Error(`s.name.value not ${name}. got ${s.name.tokenLiteral()}`);
  }

  return true;
};

const checkParserErrors = (p: Parser) => {
  const errors = p.errors;
  if (errors.length === 0) {
    return;
  }

  console.error(`parser has ${errors.length} errors`);

  errors.forEach((msg) => {
    throw new Error(`parser error: ${msg}`);
  });

  return;
};

Deno.test('test let statements', () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const l = new Lexer({ input });
  const p = new Parser({
    l: l,
    curToken: new Token({ type: token.DEFAULT, literal: 'DEFAULT' }),
    peekToken: new Token({ type: token.DEFAULT, literal: 'DEFAULT' }),
    errors: [],
  });

  const program = p.parseProgram();
  checkParserErrors(p);

  if (!program) {
    throw new Error('parseProgram() returned null');
  }
  if (program.statements.length !== 3) {
    throw new Error(
      `program.statements does not contain 3 statements. got: ${program.statements.length}`
    );
  }

  const tests = [
    { expectedIdentifier: 'x' },
    { expectedIdentifier: 'y' },
    { expectedIdentifier: 'foobar' },
  ];

  tests.forEach((test, i) => {
    const stmt = program.statements[i];
    if (!testLetStatement(stmt as LetStatement, test.expectedIdentifier)) {
      return;
    }
  });
});

Deno.test('test return statements', () => {
  const input = `
    return 5;
    return 10;
    return 993322;
  `;

  const l = new Lexer({ input });
  const p = new Parser({
    l: l,
    curToken: new Token({ type: token.DEFAULT, literal: 'DEFAULT' }),
    peekToken: new Token({ type: token.DEFAULT, literal: 'DEFAULT' }),
    errors: [],
  });

  const program = p.parseProgram();
  checkParserErrors(p);

  if (program.statements.length !== 3) {
    throw new Error(
      `program.statements does not contain 3 statements. got: ${program.statements.length}`
    );
  }

  program.statements.forEach((_, i) => {
    const stmt = program.statements[i];
    if (stmt.tokenLiteral() !== 'return') {
      throw new Error(
        `stmt.tokenLiteral() not 'return', got ${stmt.tokenLiteral()}`
      );
    }
  });
});
