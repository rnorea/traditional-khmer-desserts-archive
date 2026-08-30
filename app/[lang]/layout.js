import "../globals.css";
import collection from "../../collection.config.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default async function LocaleLayout({ children, params }) {
  return children;
}
