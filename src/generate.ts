import iconData from "feather-icons/dist/icons.json";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { IconDefinitionType } from "./icon.model";
import { iconTemplate } from "./iconComponent.template";
import { indexTemplate } from "./index.template";
import { generateTyping, transpileTypescript } from "./transformer";

const currentDirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(currentDirname, "..", "dist");

async function generate() {
  if (existsSync(distDir)) {
    await rm(distDir, { recursive: true });
  }
  await mkdir(distDir);

  const iconDefinitions: IconDefinitionType[] = Object.entries(iconData).map(
    ([iconName, iconPath]) => ({
      solidIconName: iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(""),
      iconName,
      iconPath,
    })
  );

  for (const { iconName, iconPath, solidIconName } of iconDefinitions) {
    const tsCode = iconTemplate({
      solidIconName,
      iconName,
      iconPath,
    });

    const jsCode = await transpileTypescript({
      iconName,
      tsCode,
    });

    const tsDefinition = generateTyping(tsCode);

    await writeFile(join(distDir, `${iconName}.js`), jsCode, {
      encoding: "utf8",
    });
    await writeFile(join(distDir, `${iconName}.d.ts`), tsDefinition, {
      encoding: "utf8",
    });
  }

  // Generate index.ts
  const indexTs = indexTemplate({ icons: iconDefinitions });
  const tsDefinition = generateTyping(indexTs);

  const indexJs = await transpileTypescript({
    iconName: "index",
    tsCode: indexTs,
  });
  await writeFile(join(distDir, "index.js"), indexJs, {
    encoding: "utf8",
  });
  await writeFile(join(distDir, "index.d.ts"), tsDefinition, {
    encoding: "utf8",
  });
}

generate();
