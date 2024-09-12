export function iconTemplate({
  solidIconName,
  iconName,
  iconPath,
}: {
  solidIconName: string;
  iconName: string;
  iconPath: string;
}) {
  return `
  import { ComponentProps } from "solid-js";

  export function ${solidIconName}(props: ComponentProps<"svg">) {
    return (<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"     
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      stroke="currentColor"
      class="feather feather-${iconName}"
      {...props}
    >
      ${iconPath}
    </svg>)
  }`;
}
