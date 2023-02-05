import { Lexer } from '../lexer/lexer.ts';
import { token, Token, TokenType } from '../token/token.ts';
import {
  Expression,
  ExpressionStatement,
  Identifier,
  LetStatement,
  Program,
  ReturnStatement,
  Statement,
} from '../ast/ast.ts';

const LOWEST = 1;
const EQUALS = 2;
const LESSGREATER = 3;
const SUM = 4;
const PRODUCT = 5;
const PREFIX = 6;
const CALL = 7;

type PrefixParseFn = () => Expression;
type InfixParseFn = () => Expression;

interface IParser {
  readonly l: Lexer;
  errors: string[];
  curToken: Token;
  peekToken: Token;
  prefixParseFns: Map<TokenType, PrefixParseFn>;
  infixParseFns: Map<TokenType, InfixParseFn>;
}

export class Parser {
  private readonly l: Lexer;
  readonly errors: string[];
  private curToken: Token;
  private peekToken: Token;
  private prefixParseFns: Map<TokenType, PrefixParseFn>;
  private infixParseFns: Map<TokenType, InfixParseFn>;

  constructor(_parser: IParser) {
    this.l = _parser.l;
    this.errors = _parser.errors;
    this.curToken = _parser.curToken;
    this.peekToken = _parser.peekToken;
    this.prefixParseFns = _parser.prefixParseFns;
    this.infixParseFns = _parser.infixParseFns;

    // 2つトークンを読み込む。curTokenとpeekTokenの両方がセットされる。
    this.nextToken();
    this.nextToken();

    this.prefixParseFns = new Map();
    this.registerPrefix(token.IDENT, this.parseIdentifier);
  }

  private nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

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
        return this.parseExpressionStatement();
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

  private parseExpressionStatement(): ExpressionStatement {
    const stmt = new ExpressionStatement({
      token: this.curToken,
    });

    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
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

  private registerPrefix(tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns.set(tokenType, fn);
  }

  private registerInfix(tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns.set(tokenType, fn);
  }

  private parseExpression(precedence: number): Expression | null {
    // this.curToken.typeの前に関連づけられた構文解析関数があるかを確認している
    const prefix =
      // 関数 parseIdentifier に this をバインド
      (this.prefixParseFns.get(this.curToken.type) as PrefixParseFn).bind(this); // [Function: parseIdentifier]
    if (!prefix || prefix === null) return null;
    const leftExp = prefix();
    return leftExp;
  }

  private parseIdentifier(): Expression {
    return new Identifier({
      token: this.curToken,
      value: this.curToken.literal,
    });
  }
}
