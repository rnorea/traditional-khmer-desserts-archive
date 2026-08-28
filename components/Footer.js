import collection from "../collection.config.js";
import { t } from '../data/translations.js';

export default function Footer({ language }) {
  const text = t[language] || t.en;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#" className="brand-logo">{text.brand}</a>
            <p>{collection.description}</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h5>{text.navigation}</h5>
              <ul>
                <li><a href="#">{text.theArchive}</a></li>
                <li><a href="#">{text.regionalMap}</a></li>
                <li><a href="#">{text.oralHistories}</a></li>
                <li><a href="#">{text.submitEntry}</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>{text.categories}</h5>
              <ul>
                <li><a href="#">{text.royalCourt}</a></li>
                <li><a href="#">{text.agrarian}</a></li>
                <li><a href="#">{text.fermentation}</a></li>
                <li><a href="#">{text.ritual}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 {collection.name}. {text.allRights}</p>
          <p>{text.curatedBy} {collection.curator}</p>
        </div>
      </div>
    </footer>
  );
}
