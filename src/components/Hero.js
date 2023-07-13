import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const backgroundImageUrl =
  "https://drive.google.com/uc?export=view&id=10oRl6EW_LN3arqpPakfkUpY58Kk7ZhSD"; 
  return (
    <div
    className="h-screen flex flex-col justify-center items-center"
    style={{
      position: "relative",
      background: "white",
    }}
  >
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "55%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: 0.25, 
      }}
    ></div>
      <h1 className="lg:text-9xl md:text-7xl sm:text-5xl text-3xl font-black mb-14 relative">
        ModRekt
      </h1>
      <Link
        className="py-6 px-10 bg-yellow-500 rounded-full text-3xl hover:bg-yellow-300 transition duration-300 ease-in-out flex items-center animate-bounce relative"
        to="/signup"
      >
        Sign Up Now
      </Link>
    </div>
  );
};

export default Hero;
