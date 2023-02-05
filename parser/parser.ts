import { Lexer } from '../lexer/lexer.ts';
import { token, Token, TokenType } from '../token/token.ts';
import {
  Identifier,
  LetStatement,
  Program,
  ReturnStatement,
  Statement,
} from '../ast/ast.ts';

interface IParser {
  readonly l: Lexer;
  curToken: Token;
  peekToken: Token;
  errors: string[];
}

export class Parser {
  private readonly l: Lexer;
  private curToken: Token;
  private peekToken: Token;
  readonly errors: string[];

  constructor(_parser: IParser) {
    this.l = _parser.l;
    this.curToken = _parser.curToken;
    this.peekToken = _parser.peekToken;
    this.errors = _parser.errors;

    // 2つトークンを読み込む。curTokenとpeekTokenの両方がセットされる。
    this.nextToken();
    this.nextToken();
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  // private parseLetStatement(): LetStatement {}

  public parseProgram(): Program {
    // ASTのルートノードを生成
    const program = new Program({ statements: [] });

    while (this.curToken.type !== token.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }
    return program;
  }

  /**
   * 文を構文解析する
   */
  private parseStatement(): Statement | null {
    switch (this.curToken.type) {
      case token.LET:
        return this.parseLetStatement();
      case token.RETURN:
        return this.parseReturnStatement();
      default:
        return null;
    }
  }

  private parseLetStatement(): LetStatement | null {
    const stmt = new LetStatement({
      token: this.curToken,
      name: new Identifier({
        token: this.curToken,
        value: this.curToken.literal,
      }),
      value: '',
    });

    if (!this.expectPeek(token.IDENT)) {
      return null;
    }

    stmt.name = new Identifier({
      token: this.curToken,
      value: this.curToken.literal,
    });

    if (!this.expectPeek(token.ASSIGN)) {
      return null;
    }

    // TODO: セミコロンに遭遇するまで式を読み飛ばしてしまっている
    while (!this.curTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  private parseReturnStatement(): ReturnStatement {
    const stmt = new ReturnStatement({
      token: this.curToken,
    });

    this.nextToken();

    // TODO: セミコロンに遭遇するまで式を読み飛ばしてしまっている
    while (!this.curTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  private curTokenIs(t: TokenType): boolean {
    return this.curToken.type === t;
  }

  private peekTokenIs(t: TokenType): boolean {
    return this.peekToken.type === t;
  }

  /**
   * アサーション関数
   * peekTokenの型をチェックし、それが正しい場合のみnextTokenを呼んでトークンを進める
   */
  private expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  private peekError(t: TokenType) {
    const msg = `expected next token to be ${t}, go ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }
}
