import { Star } from "lucide-react";
import React from "react";

const HeroSection = () => {
  return (
    <div
      style={{ fontFamily: "Ambit, CerebriSans, sans-serif" }}
      className="flex flex-col lg:flex-row items-center justify-between px-5 lg:px-20 py-10 gap-10"
    >
      {/* Text Section */}
      <div
        className="w-full lg:w-1/2 flex flex-col gap-5"
        style={{ fontFamily: "Ambit, CerebriSans, sans-serif" }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          DESIGN & SELL <br /> CUSTOM
          <span className="text-[#39b75d]"> T-SHIRTS</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl">
          Create unique, personalized apparel that stands out. Start selling
          with zero upfront costs.
        </p>

        <div className="flex flex-col items-start gap-4 mt-5">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#E85C0D]" />
            <h4 className="text-sm sm:text-base lg:text-lg font-medium">
              Zero upfront costs
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#E85C0D]" />
            <h4 className="text-sm sm:text-base lg:text-lg font-medium">
              Wide range of apparel options
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#E85C0D]" />
            <h4 className="text-sm sm:text-base lg:text-lg font-medium">
              Print on demand, delivered globally
            </h4>
          </div>
        </div>

        <div className="flex justify-start gap-4 mt-8 flex-wrap">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-xs sm:text-sm lg:text-base px-4 sm:px-5 py-2 sm:py-2.5"
          >
            Get Started
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-xs sm:text-sm lg:text-base px-4 sm:px-5 py-2 sm:py-2.5"
          >
            Learn More
          </button>
        </div>

        <h5 className="text-[#39b75d] mt-2 text-xs sm:text-sm lg:text-base">
          Join 8M+ creators selling custom products worldwide
        </h5>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-1/2">
        <img
          src="https://img.freepik.com/premium-vector/woman-pointing-something-gesture_22669-94.jpg?w=740"
          className="w-full h-auto object-cover"
          alt="Model wearing custom t-shirt"
        />
      </div>
    </div>
  );
};

export default HeroSection;
