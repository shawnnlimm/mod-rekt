import React from "react";

export default function About() {
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
        opacity: 0.20, 
      }}
    ></div>
    <header className="text-center mt-20 font-mono flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">About us</h1>
      <div className="max-w-4xl">
        <p className="text-lg mb-4">
          Hello! We are a team of 2 working on our Independent Software
          Development Project (Orbital).
        </p>
        <p className="text-lg mb-4">
          As students, we've always wanted to have an easy-to-use platform to
          plan our university schedules and attend classes with friends. What
          better way to do so than to create our very own timetable planning
          website! Our website aims to make schedule planning and viewing our
          friends' timetables convenient.
        </p>
      </div>
    </header>
    </div>
  );
}
