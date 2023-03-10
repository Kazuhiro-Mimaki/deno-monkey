import { Token, TokenType, token } from '../token/token.ts';
import { Lexer } from './lexer.ts';

// 字句解析器のゴール
// ソースコードを入力として受け取り、出力としてそのソースコードを表現するトークン列を返す

// memo: 字句解析器に必要なのは
// 1. 現在読んでいるのが英字かどうかを認識すること
// 2. もし英字なら 識別子/キーワード を非英字が出てくるまで読み進め、それが識別子/キーワードであるかを判定する必要がある

Deno.test('test next token', () => {
  const input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}

10 == 10;
10 != 9;
`;

  const tests: Array<{ expectedType: TokenType; expectedLiteral: string }> = [
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'five' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'ten' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'add' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.FUNCTION, expectedLiteral: 'fn' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.IDENT, expectedLiteral: 'x' },
    { expectedType: token.PLUS, expectedLiteral: '+' },
    { expectedType: token.IDENT, expectedLiteral: 'y' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.LET, expectedLiteral: 'let' },
    { expectedType: token.IDENT, expectedLiteral: 'result' },
    { expectedType: token.ASSIGN, expectedLiteral: '=' },
    { expectedType: token.IDENT, expectedLiteral: 'add' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.IDENT, expectedLiteral: 'five' },
    { expectedType: token.COMMA, expectedLiteral: ',' },
    { expectedType: token.IDENT, expectedLiteral: 'ten' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.BANG, expectedLiteral: '!' },
    { expectedType: token.MINUS, expectedLiteral: '-' },
    { expectedType: token.SLASH, expectedLiteral: '/' },
    { expectedType: token.ASTERISK, expectedLiteral: '*' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.LT, expectedLiteral: '<' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.GT, expectedLiteral: '>' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.IF, expectedLiteral: 'if' },
    { expectedType: token.LPAREN, expectedLiteral: '(' },
    { expectedType: token.INT, expectedLiteral: '5' },
    { expectedType: token.LT, expectedLiteral: '<' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.RPAREN, expectedLiteral: ')' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.RETURN, expectedLiteral: 'return' },
    { expectedType: token.TRUE, expectedLiteral: 'true' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.ELSE, expectedLiteral: 'else' },
    { expectedType: token.LBRACE, expectedLiteral: '{' },
    { expectedType: token.RETURN, expectedLiteral: 'return' },
    { expectedType: token.FALSE, expectedLiteral: 'false' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.RBRACE, expectedLiteral: '}' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.EQ, expectedLiteral: '==' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.INT, expectedLiteral: '10' },
    { expectedType: token.NOT_EQ, expectedLiteral: '!=' },
    { expectedType: token.INT, expectedLiteral: '9' },
    { expectedType: token.SEMICOLON, expectedLiteral: ';' },
    { expectedType: token.EOF, expectedLiteral: '' },
  ];

  const l = new Lexer({ input });

  tests.forEach((test) => {
    const token: Token = l.nextToken();

    if (token.type !== test.expectedType) {
      throw new Error(
        `${test} - token type is wrong. expected: ${test.expectedType}, got: ${token.type}`
      );
    }

    if (token.literal !== test.expectedLiteral) {
      throw new Error(
        `${test} - literal is wrong. expected: ${test.expectedLiteral}, got: ${token.literal}`
      );
    }
  });
});
