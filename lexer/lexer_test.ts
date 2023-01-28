import { Token, TokenType, token } from "../token/token.ts";

// 字句解析器のゴール
// ソースコードを入力として受け取り、出力としてそのソースコードを表現するトークン列を返す

Deno.test("test next token", () => {
  const input = "=+(){},;";

  const tests: Array<{ expectedType: TokenType; expectedLiteral: string }> = [
    { expectedType: token.ASSIGN, expectedLiteral: "=" },
    { expectedType: token.PLUS, expectedLiteral: "+" },
    { expectedType: token.LPAREN, expectedLiteral: "(" },
    { expectedType: token.RPAREN, expectedLiteral: ")" },
    { expectedType: token.LBRACE, expectedLiteral: "{" },
    { expectedType: token.RBRACE, expectedLiteral: "}" },
    { expectedType: token.COMMA, expectedLiteral: "," },
    { expectedType: token.SEMICOLON, expectedLiteral: ";" },
    { expectedType: token.EOF, expectedLiteral: "" },
  ];

  const l = new New(input);

  tests.forEach((test) => {
    const token: Token = l.nextToken();

    if (token.Type !== test.expectedType) {
      throw new Error(
        `${test} - token type is wrong. expected: ${test.expectedType}, got: ${token.Type}`
      );
    }

    if (token.Literal !== test.expectedLiteral) {
      throw new Error(
        `${test} - literal is wrong. expected: ${test.expectedLiteral}, got: ${token.Literal}`
      );
    }
  });
});
