import React from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";

import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";
const Home = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-10 py-24 border-2 border-red-500">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text ">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                height={20}
                width={21}
                loading="eager"
              />
            </p>
            <h1 className="head-text">
              Unleash the Power of
              <div className="text-primary"> PriceWise</div>
            </h1>
            <p className="text-base mt-6 text-gray-400">
              Powerful, self-serve product and growth analytics to help you
              convert, engage and retain more.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
