import { getProductById, getSimilarProducts } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatNumber } from "@/lib/util";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import Modal from "@/components/Modal";

interface Props {
  params: Promise<{ id: string }>;
};
const ProductDetails = async ({ params }: Props) => {
  const { id } = await params;

  const product: Product = await getProductById(id);

  if (!product) redirect("/");

  const similarProducts = await getSimilarProducts(id);

  return (
    <>
      <div className="product-container">
        <div className="flex gap-20 xl:flex-row flex-col">
          <div className="product-image">
            <Image
              src={product.image}
              alt={product.title}
              height={580}
              width={400}
              className="mx-auto"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
              <div className="flex flex-col gap-3">
                <p className="text-[20px] text-secondary font-semibold">
                  {product.title}
                </p>

                <Link
                  href={product.url}
                  target="_blank"
                  className="text-base text-black opacity-50 hover:underline"
                >
                  Visit Product
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="product-hearts">
                  <Image
                    src="/assets/icons/red-heart.svg"
                    alt="red-hearts"
                    height={20}
                    width={20}
                  />

                  <p className="text-sm font-semibold text-[#D46F77]">
                    {product.reviewCount || "100"}
                  </p>
                </div>

                <div className="p-2 bg-white-200 rounded-10">
                  <Image
                    src="/assets/icons/bookmark.svg"
                    alt="bookmarks"
                    height={20}
                    width={20}
                  />
                </div>

                <div className="p-2 bg-white-200 rounded-10">
                  <Image
                    src="/assets/icons/share.svg"
                    alt="share"
                    height={20}
                    width={20}
                  />
                </div>

                <div className="product-info ">
                  <div className="flex flex-col gap-2">
                    <p className="text-[25px] text-secondary font-bold mt-6">
                      {product.currency} {formatNumber(product.currentPrice)}{" "}
                    </p>

                    <p className="text-[10px] text-black opacity-50 line-through font-bold">
                      {product.currency} {formatNumber(product.originalPrice)}{" "}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 ">
                  <div className="flex gap-3">
                    <div className="product-stars">
                      <Image
                        src="/assets/icons/star.svg"
                        alt="star"
                        height={20}
                        width={20}
                      />
                      <p className="text-sm text-primary-orange font-semibold">
                        {product.stars || "25"}
                      </p>

                      <div className="product-reviews">
                        <Image
                          src="/assets/icons/comment.svg"
                          alt="comment"
                          width={16}
                          height={16}
                        />

                        <p className="text-sm text-secondary font-semibold">
                          {product.reviews || 300} Reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-black opacity-50">
                  <span className="text-primary-green font-semibold">
                    {" "}
                    93%{" "}
                  </span>{" "}
                  of buyers have recommended this.
                </p>
              </div>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5 ">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current-Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="#b6dbff"
              />

              <PriceInfoCard
                title="Average-Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(
                  product.averagePrice
                )}`}
                borderColor="#b6dbff"
              />

              <PriceInfoCard
                title="Highest-Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(
                  product.highestPrice
                )}`}
                borderColor="#b6dbff"
              />

              <PriceInfoCard
                title="Lowest-Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(
                  product.lowestPrice
                )}`}
                borderColor="#b6dbff"
              />
            </div>
          </div>

          <Modal productId={id}/>
        </div>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 m-10">
            <h3 className="text-3xl text-secondary font-semibold">
              Product Description
            </h3>

            <div className="flex flex-col gap-4 ">
              {product?.description?.split("\n")}
            </div>
          </div>

          <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px] mb-10">
            <Image
              src="/assets/icons/bag.svg"
              alt="check"
              height={16}
              width={16}
            />
            <Link href="/" className="text-base text-white ">Buy Now</Link>
          </button>
        </div>

        {/* checks if similar Product exist and then if the product number is greater than 0 */}
        {similarProducts && similarProducts?.length > 0 && (
          <div className="py-14 flex-col gap-2 w-full">
            <p className="section-text ">Similar Products</p>
            <div className="flex flex-wrap gap-10 mt-7 w-full">
              {similarProducts.map((product) => (
                <ProductCard key={product._id} product={product}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
