/// <reference types="vite/client" />

declare const __APP_BUILD_VERSION__: string;

declare module '*.mov' {
  const src: string;
  export default src;
}

declare module '*.MOV' {
  const src: string;
  export default src;
}
