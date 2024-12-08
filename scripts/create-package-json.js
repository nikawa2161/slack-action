import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// 現在のファイルのディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// package.json を読み込み
const basePackageJsonPath = path.resolve(__dirname, "../package.json");
const basePackageJson = JSON.parse(
  await readFile(basePackageJsonPath, "utf-8")
);

// dist 用 package.json を作成
const distPackageJson = {
  name: basePackageJson.name,
  version: basePackageJson.version,
  main: "function.js",
  type: basePackageJson.type,
  dependencies: basePackageJson.dependencies,
};

// dist/package.json を出力
const outputPath = path.resolve(__dirname, "../dist/package.json");
await writeFile(outputPath, JSON.stringify(distPackageJson, null, 2));
console.log("dist/package.json created successfully!");
