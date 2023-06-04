import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="flex h-screen max-w-full flex-col justify-between overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
