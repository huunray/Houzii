const ts = require('typescript');
const fs = require('fs');

const fileNames = ['src/app/components/hero.tsx'];

const program = ts.createProgram(fileNames, {
  noEmit: true,
  jsx: ts.JsxEmit.ReactJSX,
  esModuleInterop: true
});

const emitResult = program.emit();
const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

allDiagnostics.forEach(diagnostic => {
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  }
});
