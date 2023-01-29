import { lookupIdent, token, Token, TokenType, Uint8 } from '../token/token.ts';

interface ILexer {
  input: string;
  position?: number;
  readPosition?: number;
  ch?: Uint8;
}

export class Lexer {
  private input: string;
  private position: number; // 入力における現在の位置 (現在の文字を指し示す)
  private readPosition: number; // これから読み込む位置 (現在の文字の次)
  public ch: Uint8; // 現在検査中の文字

  constructor(_lexer: ILexer) {
    this.input = _lexer.input;
    this.position = _lexer.position ?? 0;
    this.readPosition = _lexer.readPosition ?? 0;
    this.ch = _lexer.ch ?? '';

    this.readChar();
  }

  /**
   * 次の1文字を読んでinput文字列の現在位置を進める
   */
  private readChar(): void {
    // 入力が終端に到達したかチェック
    if (this.readPosition >= this.input.length) {
      this.ch = token.EOF;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  /**
   * 現在検査中の文字(this.ch)を見て、その文字が何であるかに応じてトークンを返す
   * トークンを返す前に入力のポインタを進めて、次に nextToken() を呼んだ時に this.ch フィールドが更新されて居るようにする
   * @returns Token
   */
  public nextToken(): Token {
    let tok: Token;

    this.skipWhiteSpace();

    switch (this.ch) {
      case '=':
        if (this.peekChar() === '=') {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          tok = this.newToken(token.EQ, literal);
        } else {
          tok = this.newToken(token.ASSIGN, this.ch);
        }
        break;
      case ';':
        tok = this.newToken(token.SEMICOLON, this.ch);
        break;
      case '(':
        tok = this.newToken(token.LPAREN, this.ch);
        break;
      case ')':
        tok = this.newToken(token.RPAREN, this.ch);
        break;
      case ',':
        tok = this.newToken(token.COMMA, this.ch);
        break;
      case '+':
        tok = this.newToken(token.PLUS, this.ch);
        break;
      case '-':
        tok = this.newToken(token.MINUS, this.ch);
        break;
      case '!':
        if (this.peekChar() === '=') {
          // ローカル変数に保存することで、現在の文字を失わず、かつ字句解析器を安全に前に進められる
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          tok = this.newToken(token.NOT_EQ, literal);
        } else {
          tok = this.newToken(token.BANG, this.ch);
        }
        break;
      case '/':
        tok = this.newToken(token.SLASH, this.ch);
        break;
      case '*':
        tok = this.newToken(token.ASTERISK, this.ch);
        break;
      case '<':
        tok = this.newToken(token.LT, this.ch);
        break;
      case '>':
        tok = this.newToken(token.GT, this.ch);
        break;
      case '{':
        tok = this.newToken(token.LBRACE, this.ch);
        break;
      case '}':
        tok = this.newToken(token.RBRACE, this.ch);
        break;
      case 'EOF':
        tok = this.newToken(token.EOF, '');
        break;
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal);
          tok = this.newToken(type, literal);
          return tok;
          // memo: なぜ早期returnが必要か
          // readIdentifier() の呼び出しの中で readChar() を繰り返し呼んでおり、
          // readPositionフィールド と positionフィールド が現在の識別子の最後の文字を過ぎたところまで進んでいる。
          // そのためswitch文の後でさらに readChar() を呼ぶ必要がない。
        } else if (this.isDigit(this.ch)) {
          const literal = this.readNumber();
          const type = token.INT;
          tok = this.newToken(type, literal);
          return tok;
        } else {
          tok = this.newToken(token.ILLEGAL, this.ch);
        }
    }

    this.readChar();
    return tok;
  }

  private newToken(tokenType: TokenType, ch: Uint8): Token {
    return new Token({ type: tokenType, literal: ch });
  }

  /**
   * 識別子を読んで、非英字に到達するまで字句解析器の位置を進める
   */
  private readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  /**
   * 与えられた引数が英字かどうかを判定
   * @param ch Uint8
   * @returns boolean
   */
  public isLetter(ch: Uint8): boolean {
    return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_';
  }

  /**
   * Monkeyではホワイトスペースが意味を持たないためスキップする
   * @param ch Uint8
   */
  private skipWhiteSpace(): void {
    while (
      this.ch === ' ' ||
      this.ch === '\t' ||
      this.ch === '\n' ||
      this.ch === '\r'
    ) {
      this.readChar();
    }
  }

  private readNumber(): string {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  private isDigit(ch: Uint8): boolean {
    return '0' <= ch && ch <= '9';
  }

  /**
   * 入力を先読みする(先には進まず、あくまで入力を前もって覗き見するだけ)
   * @returns Uint8
   */
  private peekChar(): Uint8 {
    return this.readPosition >= this.input.length
      ? 0
      : this.input[this.readPosition];
  }
}
