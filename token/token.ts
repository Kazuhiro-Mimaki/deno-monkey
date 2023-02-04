export type TokenType =
  | 'DEFAULT'
  | 'ILLEGAL'
  | 'EOF'
  | 'IDENT'
  | 'INT'
  | '='
  | '+'
  | '-'
  | '!'
  | '*'
  | '/'
  | '<'
  | '>'
  | ','
  | ';'
  | '('
  | ')'
  | '{'
  | '}'
  | 'FUNCTION'
  | 'LET'
  | 'TRUE'
  | 'FALSE'
  | 'IF'
  | 'ELSE'
  | 'RETURN'
  | '=='
  | '!=';

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
  // 書籍にはないカスタマイズ
  DEFAULT: 'DEFAULT',

  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  // 識別子 + リテラル
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456

  // 演算子
  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  BANG: '!',
  ASTERISK: '*',
  SLASH: '/',

  LT: '<',
  GT: '>',

  // デリミタ
  COMMA: ',',
  SEMICOLON: ';',

  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',

  // キーワード
  FUNCTION: 'FUNCTION',
  LET: 'LET',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  IF: 'IF',
  ELSE: 'ELSE',
  RETURN: 'RETURN',

  EQ: '==',
  NOT_EQ: '!=',
} as const;

export const keywords: Map<string, TokenType> = new Map([
  ['fn', token.FUNCTION],
  ['let', token.LET],
  ['true', token.TRUE],
  ['false', token.FALSE],
  ['if', token.IF],
  ['else', token.ELSE],
  ['return', token.RETURN],
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
