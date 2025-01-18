const Banner = () => {
  return (
    <div className="h-96 text-white text-center grid bg-cover bg-[url('https://ww2.kqed.org/app/uploads/sites/10/2022/09/Mental-Health-Feature-e1662671428167.jpg')]">
      <div className="col-start-1 row-start-1 bg-gray-800 bg-opacity-60 w-full h-full"></div>
      <div className="col-start-1 row-start-1 mx-auto my-auto">
        <h1 className="font-bold text-5xl">
          “Understanding Minds, Changing Lives”
        </h1>
      </div>
    </div>
  );
};

export default Banner;
