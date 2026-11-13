import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../features/theme/ThemeToggle";
function AppLayout() {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Applications", path: "/applications" },
    { name: "Pipeline", path: "/pipeline" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white">
      <header className="border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold">
            Applied
          </h1>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;