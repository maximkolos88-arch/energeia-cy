/// <reference types="vite/client" />

import 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string | boolean;
  }
  interface HTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
