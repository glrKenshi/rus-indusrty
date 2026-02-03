import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-industrial-darker border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: currentYear })}
          </div>

          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-lime transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-lime transition-colors"
            >
              {t("footer.contacts")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
