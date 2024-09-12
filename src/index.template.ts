import { IconDefinitionType } from "./icon.model";

export function indexTemplate({ icons }: { icons: IconDefinitionType[] }) {
  return `
   

    export type IconType = ${icons
      .map(({ solidIconName }) => `'${solidIconName}'`)
      .join(" | ")};
  `;
}
