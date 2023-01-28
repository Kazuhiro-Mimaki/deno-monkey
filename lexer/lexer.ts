import { token, Token, TokenType } from "../token/token.ts";

type Uint8 = string | number;

export class Lexer {
  private input: string;
  private position: number; // 入力における現在の位置 (現在の文字を指し示す)
  private readPosition: number; // これから読み込む位置 (現在の文字の次)
  private ch: Uint8; // 現在検査中の文字

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = this.input[this.readPosition];
    this.readChar();
  }

  /**
   * 次の1文字を読んでinput文字列の現在位置を進める
   */
  readChar() {
    // 入力が終端に到達したかチェック
    if (this.readPosition >= this.input.length) {
      this.ch = "";
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
  nextToken(): Token {
    let tok: Token;

    switch (this.ch) {
      case "=":
        tok = this.newToken(token.ASSIGN, this.ch);
        break;
      case ";":
        tok = this.newToken(token.SEMICOLON, this.ch);
        break;
      case "(":
        tok = this.newToken(token.LPAREN, this.ch);
        break;
      case ")":
        tok = this.newToken(token.RPAREN, this.ch);
        break;
      case ",":
        tok = this.newToken(token.COMMA, this.ch);
        break;
      case "+":
        tok = this.newToken(token.PLUS, this.ch);
        break;
      case "{":
        tok = this.newToken(token.LBRACE, this.ch);
        break;
      case "}":
        tok = this.newToken(token.RBRACE, this.ch);
        break;
      default:
        tok = this.newToken(token.EOF, "");
    }

    this.readChar();
    return tok;
  }

  private newToken(tokenType: TokenType, ch: Uint8): Token {
    return new Token({ type: tokenType, literal: ch.toString() });
  }
}
