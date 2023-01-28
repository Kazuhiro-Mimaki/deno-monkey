export type TokenType = string;

export class Token {
  public readonly type: TokenType;
  public readonly literal: string;

  constructor(_token: Token) {
    this.type = _token.type;
    this.literal = _token.literal;
  }
}

export const token = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",

  // 識別子 + リテラル
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT", // 1343456

  // 演算子
  ASSIGN: "=",
  PLUS: "+",

  // デリミタ
  COMMA: ",",
  SEMICOLON: ",",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  // キーワード
  FUNCTION: "FUNCTION",
  LET: "LET",
};
