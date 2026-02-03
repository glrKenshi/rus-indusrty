import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/Hero";
import SoftwareProducts from "@/components/SoftwareProducts";
import TargetAudience from "@/components/TargetAudience";
import Advantages from "@/components/Advantages";
import WorkflowDiagram from "@/components/WorkflowDiagram";
import ContactForm from "@/components/ContactForm";

export default function Index() {
  return (
    <PageLayout>
      <Header />
      <main>
        <Hero />
        <SoftwareProducts />
        <TargetAudience />
        <Advantages />
        <WorkflowDiagram />
        <ContactForm />
      </main>
      <Footer />
    </PageLayout>
  );
}
