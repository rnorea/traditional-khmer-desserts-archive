import "../globals.css";
import collection from "../../collection.config.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  
  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}
