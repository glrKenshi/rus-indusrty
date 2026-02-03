import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("toast.requestSent"),
      description: t("toast.willContact"),
    });
    setFormData({ name: "", company: "", email: "", phone: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-industrial-darker to-background"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div className="animate-fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t("contactForm.title")}{" "}
                <span className="text-primary">{t("contactForm.titleHighlight")}</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("contactForm.description")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-lime" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("contactForm.phone")}
                    </div>
                    <a
                      href="tel:+78001234567"
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      +7 (800) 123-45-67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-lime" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("contactForm.email")}
                    </div>
                    <a
                      href="mailto:info@foodtech.su"
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      info@foodtech.su
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-lime" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("contactForm.address")}
                    </div>
                    <div className="text-foreground font-medium whitespace-pre-line">
                      {t("contactForm.addressValue")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <form
                onSubmit={handleSubmit}
                className="bg-gradient-card border border-border rounded-2xl p-6 lg:p-8"
                data-testid="contact-form"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t("contactForm.name")}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50 focus-visible:border-lime focus-visible:ring-lime/20"
                      placeholder={t("contactForm.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t("contactForm.company")}
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="bg-background/50 focus-visible:border-lime focus-visible:ring-lime/20"
                      placeholder={t("contactForm.companyPlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t("contactForm.email")} *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50 focus-visible:border-lime focus-visible:ring-lime/20"
                      placeholder={t("contactForm.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t("contactForm.phone")}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background/50 focus-visible:border-lime focus-visible:ring-lime/20"
                      placeholder={t("contactForm.phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t("contactForm.comment")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="bg-background/50 resize-none focus-visible:border-lime focus-visible:ring-lime/20"
                      placeholder={t("contactForm.messagePlaceholder")}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full hover:shadow-glow-lime hover:border hover:border-lime/50"
                  >
                    {t("contactForm.submit")}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t("contactForm.privacyNote")}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
