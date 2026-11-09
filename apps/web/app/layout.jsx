export const metadata = {
  title: "E-Care Connect",
  description: "Rwanda-first health information exchange platform"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body style={{ margin: 0, background: "#faf9f6", color: "#171717" }}>{children}</body></html>;
}
