import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";

type HomePageProps = {
  searchParams: { category?: string; search?: string };
};

async function HomePage({ searchParams }: HomePageProps) {
  const { category, search } = await searchParams;

  return (
    <section>
      <CategoriesList category={category} search={search} />
      <PropertiesContainer category={category} search={search} />
    </section>
  );
}

export default HomePage;
