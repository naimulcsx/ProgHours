import { SVGProps } from "react";

export function TimusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="#1A5CC8"
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
      ></path>
      <path
        fill="#fff"
        d="M6.27 14.318v-1.59h6.32v1.59h-2.187V20H8.457v-5.682H6.27zm9.038-1.59V20h-1.974v-7.273h1.974zm.936 0h2.457l1.69 4.119h.086l1.69-4.12h2.458V20h-1.932v-4.204h-.057l-1.62 4.147h-1.164l-1.62-4.176h-.056V20h-1.932v-7.273z"
      ></path>
    </svg>
  );
}
