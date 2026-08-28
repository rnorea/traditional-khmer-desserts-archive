import "./globals.css";
import collection from "../collection.config.js";
import { cookies } from "next/headers";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "en";

  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}
