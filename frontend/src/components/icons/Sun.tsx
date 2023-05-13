import { SVGProps } from 'react';

export const Sun = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 20.8C17.273 20.8 18.4939 20.2943 19.3941 19.3941C20.2943 18.4939 20.8 17.273 20.8 16C20.8 14.727 20.2943 13.5061 19.3941 12.6059C18.4939 11.7057 17.273 11.2 16 11.2C14.727 11.2 13.5061 11.7057 12.6059 12.6059C11.7057 13.5061 11.2 14.727 11.2 16C11.2 17.273 11.7057 18.4939 12.6059 19.3941C13.5061 20.2943 14.727 20.8 16 20.8ZM16 24C13.8783 24 11.8434 23.1571 10.3431 21.6569C8.84285 20.1566 8 18.1217 8 16C8 13.8783 8.84285 11.8434 10.3431 10.3431C11.8434 8.84285 13.8783 8 16 8C18.1217 8 20.1566 8.84285 21.6569 10.3431C23.1571 11.8434 24 13.8783 24 16C24 18.1217 23.1571 20.1566 21.6569 21.6569C20.1566 23.1571 18.1217 24 16 24ZM16 0C16.4243 0 16.8313 0.168571 17.1314 0.468629C17.4314 0.768687 17.6 1.17565 17.6 1.6V4.8C17.6 5.22435 17.4314 5.63131 17.1314 5.93137C16.8313 6.23143 16.4243 6.4 16 6.4C15.5757 6.4 15.1687 6.23143 14.8686 5.93137C14.5686 5.63131 14.4 5.22435 14.4 4.8V1.6C14.4 1.17565 14.5686 0.768687 14.8686 0.468629C15.1687 0.168571 15.5757 0 16 0ZM16 25.6C16.4243 25.6 16.8313 25.7686 17.1314 26.0686C17.4314 26.3687 17.6 26.7757 17.6 27.2V30.4C17.6 30.8243 17.4314 31.2313 17.1314 31.5314C16.8313 31.8314 16.4243 32 16 32C15.5757 32 15.1687 31.8314 14.8686 31.5314C14.5686 31.2313 14.4 30.8243 14.4 30.4V27.2C14.4 26.7757 14.5686 26.3687 14.8686 26.0686C15.1687 25.7686 15.5757 25.6 16 25.6ZM1.6 14.4H4.8C5.22435 14.4 5.63131 14.5686 5.93137 14.8686C6.23143 15.1687 6.4 15.5757 6.4 16C6.4 16.4243 6.23143 16.8313 5.93137 17.1314C5.63131 17.4314 5.22435 17.6 4.8 17.6H1.6C1.17565 17.6 0.768687 17.4314 0.468629 17.1314C0.168571 16.8313 0 16.4243 0 16C0 15.5757 0.168571 15.1687 0.468629 14.8686C0.768687 14.5686 1.17565 14.4 1.6 14.4ZM27.2 14.4H30.4C30.8243 14.4 31.2313 14.5686 31.5314 14.8686C31.8314 15.1687 32 15.5757 32 16C32 16.4243 31.8314 16.8313 31.5314 17.1314C31.2313 17.4314 30.8243 17.6 30.4 17.6H27.2C26.7757 17.6 26.3687 17.4314 26.0686 17.1314C25.7686 16.8313 25.6 16.4243 25.6 16C25.6 15.5757 25.7686 15.1687 26.0686 14.8686C26.3687 14.5686 26.7757 14.4 27.2 14.4ZM27.3136 4.6864C27.6136 4.98644 27.7821 5.39334 27.7821 5.8176C27.7821 6.24186 27.6136 6.64876 27.3136 6.9488L25.0512 9.2112C24.9036 9.36402 24.7271 9.48591 24.5318 9.56976C24.3366 9.65362 24.1267 9.69776 23.9142 9.6996C23.7018 9.70145 23.4911 9.66096 23.2945 9.58051C23.0978 9.50007 22.9192 9.38126 22.769 9.23103C22.6187 9.0808 22.4999 8.90216 22.4195 8.70553C22.339 8.50889 22.2986 8.29821 22.3004 8.08576C22.3022 7.87331 22.3464 7.66336 22.4302 7.46815C22.5141 7.27295 22.636 7.09639 22.7888 6.9488L25.0512 4.6864C25.3512 4.38645 25.7581 4.21794 26.1824 4.21794C26.6067 4.21794 27.0136 4.38645 27.3136 4.6864ZM9.2112 22.7888C9.51115 23.0888 9.67966 23.4957 9.67966 23.92C9.67966 24.3443 9.51115 24.7512 9.2112 25.0512L6.9488 27.312C6.80121 27.4648 6.62465 27.5867 6.42945 27.6706C6.23424 27.7544 6.02429 27.7986 5.81184 27.8004C5.5994 27.8022 5.38871 27.7618 5.19207 27.6813C4.99544 27.6009 4.8168 27.4821 4.66657 27.3318C4.51634 27.1816 4.39753 27.003 4.31709 26.8063C4.23664 26.6097 4.19615 26.399 4.198 26.1866C4.19985 25.9741 4.24398 25.7642 4.32784 25.569C4.41169 25.3737 4.53358 25.1972 4.6864 25.0496L6.9488 22.7872C7.24884 22.4872 7.65574 22.3187 8.08 22.3187C8.50426 22.3187 8.91116 22.4872 9.2112 22.7872V22.7888ZM6.9488 4.6864L9.2112 6.9488C9.50265 7.25056 9.66392 7.65473 9.66028 8.07424C9.65663 8.49376 9.48836 8.89506 9.19171 9.19171C8.89506 9.48836 8.49376 9.65663 8.07424 9.66028C7.65473 9.66392 7.25056 9.50265 6.9488 9.2112L4.688 6.9488C4.4084 6.64501 4.25705 6.2449 4.2656 5.83212C4.27416 5.41933 4.44194 5.02583 4.73389 4.73389C5.02583 4.44194 5.41933 4.27416 5.83212 4.2656C6.2449 4.25705 6.64501 4.4084 6.9488 4.688V4.6864ZM25.0512 22.7888L27.3136 25.0512C27.6051 25.353 27.7663 25.7571 27.7627 26.1766C27.759 26.5962 27.5908 26.9975 27.2941 27.2941C26.9975 27.5908 26.5962 27.759 26.1766 27.7627C25.7571 27.7663 25.353 27.6051 25.0512 27.3136L22.7888 25.0512C22.636 24.9036 22.5141 24.7271 22.4302 24.5318C22.3464 24.3366 22.3022 24.1267 22.3004 23.9142C22.2986 23.7018 22.339 23.4911 22.4195 23.2945C22.4999 23.0978 22.6187 22.9192 22.769 22.769C22.9192 22.6187 23.0978 22.4999 23.2945 22.4195C23.4911 22.339 23.7018 22.2986 23.9142 22.3004C24.1267 22.3022 24.3366 22.3464 24.5318 22.4302C24.7271 22.5141 24.9036 22.636 25.0512 22.7888Z"
        fill="currentColor"
      />
    </svg>
  );
};
