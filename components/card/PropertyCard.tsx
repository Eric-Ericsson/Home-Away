import Image from "next/image";
import Link from "next/link";
// import CountryFlagAndName from "./CountryFlagAndName";
// import PropertyRating from "./PropertyRating";
// import FavoriteToggleButton from "./FavoriteToggleButton";
import { PropertyCardProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import PropertyRating from "./PropertyRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import CountryFlagAndName from "./CountryFlagAndName";

function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { name, image, price } = property;
  const { country, id: propertyId, tagline } = property;

  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative mb-2 h-[300px] overflow-hidden rounded-md">
          <Image
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            alt={name}
            className="transform rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex items-center justify-between">
          <h3 className="mt-1 text-sm font-semibold">
            {name.substring(0, 30)}
          </h3>
          {/* property rating */}
          <PropertyRating inPage={false} propertyId={propertyId} />
        </div>
        <p className="text-muted-foreground mt-1 text-sm ">
          {tagline.substring(0, 40)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="mt-1 text-sm ">
            <span className="font-semibold">{formatCurrency(price)} </span>
            night
          </p>
          {/* country and flag */}
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>
      <div className="z-5 absolute right-5 top-5">
        {/* favorite toggle button */}
        <FavoriteToggleButton propertyId={propertyId} />
      </div>
    </article>
  );
}

export default PropertyCard;
