import { Lexer } from '../lexer/lexer.ts';
import { Token } from '../token/token.ts';
import { Program } from '../ast/ast.ts';

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

  public parseProgram(): Program | null {
    return null;
  }
}
