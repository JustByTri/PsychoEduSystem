import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="p-4 text-gray-600 text-sm">
      <div className="flex items-center space-x-2">
        {/* Home Link */}
        <Link
          to="/"
          className="text-blue-600 font-medium hover:underline transition duration-300"
        >
          Home
        </Link>

        {/* Breadcrumb Items */}
        {pathnames.length > 0 && (
          <>
            <ChevronRight size={16} className="text-gray-400" />
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return (
                <div key={name} className="flex items-center space-x-2">
                  {isLast ? (
                    <span className="text-white font-semibold capitalize">
                      {name.replace("-", " ")}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="text-blue-600 font-medium hover:underline transition duration-300 capitalize"
                    >
                      {name.replace("-", " ")}
                    </Link>
                  )}
                  {index < pathnames.length - 1 && (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </nav>
  );
};

export default Breadcrumbs;
