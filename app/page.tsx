import LoadingCards from "@/components/card/LoadingCards";
import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: { category?: string; search?: string };
};

async function HomePage({ searchParams }: HomePageProps) {
  const { category, search } = await searchParams;

  return (
    <section>
      <CategoriesList category={category} search={search} />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams?.category}
          search={searchParams?.search}
        />
      </Suspense>
    </section>
  );
}

export default HomePage;
