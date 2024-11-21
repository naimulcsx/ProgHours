import { Title } from '@mantine/core';

import { SVGProps } from 'react';

export function AppLogoSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="131"
      height="128"
      fill="none"
      viewBox="0 0 131 128"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M53.734 2.75c7.117-3.667 15.712-3.667 22.829 0l41.261 21.258c7.688 3.961 12.473 11.587 12.473 19.876v40.232c0 8.29-4.785 15.915-12.473 19.876L76.563 125.25c-7.117 3.667-15.712 3.667-22.829 0l-41.26-21.258C4.786 100.031 0 92.405 0 84.116V43.884c0-8.29 4.786-15.915 12.474-19.876z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#FBFAFC"
        d="M64 86.73c13.413 0 24.287-10.61 24.287-23.697S77.413 39.335 64 39.335s-24.287 10.61-24.287 23.698S50.587 86.73 64 86.73"
      ></path>
    </svg>
  );
}

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2">
      <AppLogoSquare {...props} />
      <Title order={4} component="span">
        progHours
      </Title>
    </div>
  );
}
