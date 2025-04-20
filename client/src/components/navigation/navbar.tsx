import { Link } from "wouter";
import { NavigationMenuItem } from "../ui/navigation-menu";

const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700";

export const Navbar = () => {
  return (
    <>
      <NavigationMenuItem>
        <Link to="/astrology" className={navLinkClasses}>
          Astrology
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/horoscope" className={navLinkClasses}>
          Horoscope
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/interactive-wheel" className={navLinkClasses}>
          Astrology Wheel
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <div className="flex flex-col gap-2">
          <Link to="/pricing" className={navLinkClasses}>
            Pricing
          </Link>
          <Link to="/blog" className={navLinkClasses}>
            Blog
          </Link>
          <Link to="/shop" className={navLinkClasses}>
            Shop
          </Link>
        </div>
      </NavigationMenuItem>
    </>
  );
};
