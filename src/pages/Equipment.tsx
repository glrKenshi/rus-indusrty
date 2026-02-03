import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLayout from "@/components/layout/PageLayout";
import EquipmentCatalog from "@/components/EquipmentCatalog";

export default function Equipment() {
  return (
    <PageLayout backgroundSize="auto 60vh">
      <Header />
      <main>
        <EquipmentCatalog />
      </main>
      <Footer />
    </PageLayout>
  );
}







