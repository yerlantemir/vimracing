import { SVGProps } from 'react';

export const RefreshIcon = (props: SVGProps<SVGSVGElement>) => {
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
        d="M10 4.5625C10 4.5625 10.7613 4.1875 8 4.1875C7.0111 4.1875 6.0444 4.48074 5.22215 5.03015C4.39991 5.57956 3.75904 6.36045 3.3806 7.27408C3.00217 8.18771 2.90315 9.19305 3.09608 10.163C3.289 11.1329 3.76521 12.0238 4.46447 12.723C5.16373 13.4223 6.05465 13.8985 7.02455 14.0914C7.99446 14.2844 8.99979 14.1853 9.91342 13.8069C10.827 13.4285 11.6079 12.7876 12.1573 11.9654C12.7068 11.1431 13 10.1764 13 9.1875"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M8 1.8125L10.5 4.3125L8 6.8125"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
