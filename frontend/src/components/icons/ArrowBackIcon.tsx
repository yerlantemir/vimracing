import { SVGProps } from 'react';

export const ArrowBackIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.99967 7.33317L3.33301 9.99984M3.33301 9.99984L5.99967 12.6665M3.33301 9.99984H10.6663C11.3736 9.99984 12.0519 9.71889 12.552 9.21879C13.0521 8.71869 13.333 8.04041 13.333 7.33317C13.333 6.62593 13.0521 5.94765 12.552 5.44755C12.0519 4.94746 11.3736 4.6665 10.6663 4.6665H9.99967"
        stroke="currentColor"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
