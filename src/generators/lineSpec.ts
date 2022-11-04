import { ICompiler } from "./ICompiler.ts";

export class LineSpec implements ICompiler {
  line: string;
  indent: number;
  aligned: boolean;
  _spacesPerIndent = 4;

  constructor(line: string = '', indent = 0, aligned = false) {
    this.line = line;
    this.indent = indent;
    this.aligned = aligned;
  }

  getIndent() {
    return ' '.repeat(this._spacesPerIndent * this.indent);
  }

  compile(): string {
    return this.aligned ? this.line : this.getIndent() + this.line;
  }
}
