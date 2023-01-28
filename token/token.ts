export type TokenType =
  | "ILLEGAL"
  | "EOF"
  | "IDENT"
  | "INT"
  | "="
  | "+"
  | "-"
  | "!"
  | "*"
  | "/"
  | "<"
  | ">"
  | ","
  | ";"
  | "("
  | ")"
  | "{"
  | "}"
  | "FUNCTION"
  | "LET"
  | "EOF";

export type Uint8 = string | number;

export class Token {
  public readonly type: TokenType;
  public literal: Uint8;

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
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",

  LT: "<",
  GT: ">",

  // デリミタ
  COMMA: ",",
  SEMICOLON: ";",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  // キーワード
  FUNCTION: "FUNCTION",
  LET: "LET",
} as const;

const keywords: Map<string, TokenType> = new Map([
  ["fn", token.FUNCTION],
  ["let", token.LET],
]);

/**
 * 渡された識別子がキーワードかどうかチェック
 * @param ident string
 * @returns TokenType
 */
export const lookupIdent = (ident: string): TokenType => {
  const tok = keywords.get(ident);
  return tok || token.IDENT;
};
