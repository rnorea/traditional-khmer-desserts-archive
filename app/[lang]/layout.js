import "../globals.css";
import collection from "../../collection.config.js";

export const metadata = {
  title: "Khmer desserts archive",
  description: collection.description,
};

export default async function LocaleLayout({ children, params }) {
  return children;
}
