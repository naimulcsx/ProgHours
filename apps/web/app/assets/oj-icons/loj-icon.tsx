import { SVGProps } from 'react';

export function LightOJIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <rect width="32" height="32" fill="#7A4EFB" rx="16"></rect>
      <path
        fill="#FEFCFD"
        fillRule="evenodd"
        d="M14.438 7v14.794h7.644V25H10V7h4.438z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
