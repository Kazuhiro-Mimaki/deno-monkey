import { Token, Uint8 } from '../token/token.ts';

export type Node = {
  /**
   * デバッグとテストのためだけに用いる
   */
  tokenLiteral: () => Uint8;
};

export type Expression = Node & {
  token: Token;
  value: string;
  expressionNode: () => void;
};

export type Statement = Node & {
  token: Token;
  name: Identifier;
  value: string;
  statementNode: () => void;
};

/**
 * 構文解析器が生成する全てのASTのルートノードになるもの
 */
export class Program {
  public readonly statements: Statement[];

  constructor(_program: Program) {
    this.statements = _program.statements;
  }

  private tokenLiteral(): Uint8 {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : '';
  }
}

export class Identifier implements Expression {
  readonly token: Token; // token.IDENTトークン
  readonly value: string;

  constructor(_identifier: Identifier) {
    this.token = _identifier.token;
    this.value = _identifier.value;
  }

  public expressionNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }
}

export class LetStatement implements Statement {
  readonly token: Token; // token.LETトークン
  readonly name: Identifier; // 識別子を保持する
  readonly value: string; // 値を生成する式を保持する

  constructor(_letStatement: LetStatement) {
    this.token = _letStatement.token;
    this.name = _letStatement.name;
    this.value = _letStatement.value;
  }

  public statementNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }
}
