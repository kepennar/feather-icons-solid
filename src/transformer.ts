import * as ts from "typescript";
import { transformAsync, TransformOptions } from "@babel/core";
import esbuild from "esbuild";

export async function transpileTypescript({
  iconName,
  tsCode,
}: {
  iconName: string;
  tsCode: string;
}) {
  // Use Babel to transform the code
  const babelOptions: TransformOptions = {
    presets: [
      "@babel/preset-typescript",
      ["babel-preset-solid", { generate: "dom", hydratable: false }],
    ],
    filename: `${iconName}.tsx`, // This helps Babel understand it's a TypeScript file
  };

  const babelResult = await transformAsync(tsCode, babelOptions);

  if (!babelResult || !babelResult.code) {
    throw new Error(`Failed to transform ${iconName}`);
  }

  // Use esbuild to bundle the transformed code
  const esbuildResult = await esbuild.transform(babelResult.code, {
    loader: "js",
    target: "esnext",
    format: "esm",
    minify: true,
  });
  return esbuildResult.code;
}
export function generateTyping(tsCode: string) {
  const tsOptions: ts.CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: true,
  };

  let output = "";
  const compilerHost = ts.createCompilerHost(tsOptions);
  compilerHost.readFile = (_) => tsCode;
  compilerHost.writeFile = (_, contents) => (output = contents);

  const program = ts.createProgram({
    rootNames: ["foo"] as const,
    options: tsOptions,
    host: compilerHost,
  });
  program.emit();
  return output;
}
