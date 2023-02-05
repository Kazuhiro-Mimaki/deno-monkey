import { Token, Uint8 } from '../token/token.ts';

export type Node = {
  /**
   * デバッグとテストのためだけに用いる
   */
  tokenLiteral: () => Uint8;
  string: () => Uint8;
};

export type Expression = Node & {
  token: Token;
  value: Uint8;
  expressionNode: () => void;
};

export type Statement = Node & {
  token: Token;
  statementNode: () => void;
};

interface IProgram {
  statements: Statement[];
}

/**
 * 構文解析器が生成する全てのASTのルートノードになるもの
 */
export class Program {
  public readonly statements: Statement[];

  constructor(_program: IProgram) {
    this.statements = _program.statements;
  }

  public tokenLiteral(): Uint8 {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : '';
  }

  public string(): Uint8 {
    let out = '';
    this.statements.forEach((s) => {
      out += s.string();
    });
    return out;
  }
}

interface IIdentifier {
  token: Token;
  value: Uint8;
}

export class Identifier implements Expression {
  readonly token: Token; // token.IDENTトークン
  readonly value: Uint8;

  constructor(_identifier: IIdentifier) {
    this.token = _identifier.token;
    this.value = _identifier.value;
  }

  public expressionNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }

  public string(): Uint8 {
    return this.value;
  }
}

interface ILetStatement {
  token: Token;
  name: Identifier;
  value: string;
}

export class LetStatement implements Statement {
  readonly token: Token; // token.LETトークン
  name: Identifier; // 識別子を保持する
  readonly value: string; // 値を生成する式を保持する

  constructor(_letStatement: ILetStatement) {
    this.token = _letStatement.token;
    this.name = _letStatement.name;
    this.value = _letStatement.value;
  }

  public statementNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }

  public string(): Uint8 {
    let out = `${this.tokenLiteral()} ${this.name.string()} = `;
    if (this.value !== null) {
      out += this.value.toString();
    }
    out += ';';
    return out.toString();
  }
}

interface IReturnStatement {
  token: Token;
  returnValue?: Expression;
}

export class ReturnStatement implements Statement {
  readonly token: Token; // 'return' トークン
  readonly returnValue?: Expression;

  constructor(_returnStatement: IReturnStatement) {
    this.token = _returnStatement.token;
    this.returnValue = _returnStatement.returnValue;
  }

  public statementNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }

  public string(): Uint8 {
    let out = `${this.tokenLiteral()} `;
    if (this.returnValue !== null) {
      out += this.returnValue?.toString();
    }
    out += ';';
    return out.toString();
  }
}

type IExpressionStatement = {
  token: Token;
  expression?: Expression;
};

export class ExpressionStatement implements Statement {
  readonly token: Token; // 式の最初のトークン
  expression?: Expression | null;

  constructor(_expressionStatement: IExpressionStatement) {
    this.token = _expressionStatement.token;
    this.expression = _expressionStatement.expression;
  }

  public statementNode() {}
  public tokenLiteral(): Uint8 {
    return this.token.literal;
  }

  public string(): Uint8 {
    if (this.expression !== null) {
      return this.expression?.string() || '';
    }
    return '';
  }
}
