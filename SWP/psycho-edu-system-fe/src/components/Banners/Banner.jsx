const Banner = () => {
  return (
    <div className="h-[80vh] text-white text-center grid bg-cover bg-center bg-no-repeat bg-[url('https://ww2.kqed.org/app/uploads/sites/10/2022/09/Mental-Health-Feature-e1662671428167.jpg')]">
      <div className="col-start-1 row-start-1 bg-gray-800 bg-opacity-60 w-full h-full"></div>
      <div className="col-start-1 row-start-1 mx-auto my-auto max-w-4xl px-4">
        <h1 className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
          Welcome to the FPTU Education System!
        </h1>
        <p className="px-6 py-6 text-sm md:text-xl lg:text-2xl font-thin leading-relaxed mb-6">
          As the first and only Vietnamese school to be fully accredited by the
          Council of International Schools (CIS), FPTU is proud to educate a new
          generation of Vietnamese with a global citizenship mindset, lifelong
          learning skills, and a desire to create the future.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Banner;
