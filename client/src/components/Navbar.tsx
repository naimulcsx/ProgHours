import Logo from "./Logo"
import { Link } from "react-router-dom"
import DropdownMenu from "./DropdownMenu"

const Navbar = () => {
  const name = localStorage.getItem("name")
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm shadow-primary/5 bg-white`}
    >
      <Link to="/dashboard">
        <Logo className="text-gray-900" />
      </Link>
      <nav>
        <ul className="flex items-center justify-end space-x-2">
          <li className="flex items-center">
            <Link to="/profile" className="flex items-center space-x-2">
              <img
                src={`https://robohash.org/${name}?bgset=bg2&size=48x48`}
                alt={name}
                className="rounded-full w-7 h-7"
              />
              <span className="hidden font-medium text-gray-900 md:block">
                {name}
              </span>
            </Link>
          </li>
          <li className="flex items-center">
            <DropdownMenu />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
