import LogoHeader from "../assets/logo-header.png";
import Avatar from "../assets/avatar.png";
const Header = () => {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="bg-[#C9EDE4]  px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <img src={LogoHeader} className="mr-3 h-6 sm:h-9" />
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4 w-full md:w-auto transition-all duration-300">
            <img
              src={Avatar}
              alt="User Avatar"
              className="h-8 sm:h-10 rounded-full object-cover"
            />
            <p className="text-sm font-thin uppercase text-center md:text-left">
              Welcome, Peter Parker
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
