export type TokenType = string;

export type Token = {
  Type: TokenType;
  Literal: string;
};

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
