"use client";

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImages = [
  { src: "/assets/images/hero-1.svg", alt: "hero-1" },
  { src: "/assets/images/hero-2.svg", alt: "hero-2" },
  { src: "/assets/images/hero-3.svg", alt: "hero-3" },
  { src: "/assets/images/hero-4.svg", alt: "hero-4" },
  { src: "/assets/images/hero-5.svg", alt: "hero-5" },
];
const HeroCarousel = () => {
  return (
    <div className="hero-carousel mt-10">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <Image
            src={image.src}
            alt={image.alt}
            height={484}
            width={484}
            className="object-contain"
            key={image.alt}
          />
        ))}
      </Carousel>

      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="hand drawn arrow"
        height={175}
        width={175}
        className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
      />
    </div>
  );
};

export default HeroCarousel;
