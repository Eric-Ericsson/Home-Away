"use client";

import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";

function ClientComponent({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const category = searchParams?.category || "";
  const search = searchParams?.search || "";

  return (
    <>
      <CategoriesList category={category} search={search} />
      <PropertiesContainer category={category} search={search} />
    </>
  );
}

export default ClientComponent;