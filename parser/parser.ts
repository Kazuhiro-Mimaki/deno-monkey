import { Lexer } from '../lexer/lexer.ts';
import { token, Token, TokenType } from '../token/token.ts';
import { Identifier, LetStatement, Program, Statement } from '../ast/ast.ts';

interface IParser {
  readonly l: Lexer;
  curToken?: Token;
  peekToken?: Token;
}

export class Parser {
  private readonly l: Lexer;
  private curToken?: Token;
  private peekToken?: Token;

  constructor(_parser: IParser) {
    this.l = _parser.l;
    this.curToken = _parser.curToken;
    this.peekToken = _parser.peekToken;
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
    while (this.curToken?.type != token.EOF) {
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
    switch (this.curToken?.type) {
      case token.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  private parseLetStatement(): LetStatement | null {
    if (!this.expectPeek(token.IDENT)) {
      return null;
    }

    if (!this.expectPeek(token.ASSIGN)) {
      return null;
    }

    const stmt = new LetStatement({
      token: this.curToken as Token,
      name: new Identifier({
        token: this.curToken as Token,
        value: this.curToken?.literal as string,
      }),
      value: '',
    });

    // TODO: セミコロンに遭遇するまで式を読み飛ばしてしまっている
    while (!this.curTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  private curTokenIs(t: TokenType): boolean {
    return this.curToken?.type === t;
  }

  private peekTokenIs(t: TokenType): boolean {
    return this.peekToken?.type === t;
  }

  private expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      return false;
    }
  }
}
