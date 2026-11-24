import { useCallback, useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * The app shell for all signed-in panels.
 * Wraps the student, staff and account pages with navigation.
 *
 * `variant="light"` switches the workspace canvas and top bar to the light
 * student-dashboard treatment while keeping the navy sidebar.
 */
export default function DashboardLayout({
  title,
  subtitle,
  navItems = [],
  children,
  variant = "dark",
  searchValue,
  onSearchChange,
  notificationCount = 0,
  showHome = false,
  showRole = false,
  mainClassName,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const light = variant === "light";
  const student = useAuth().user?.role === "student";

  return (
    <div
      className={`${student ? "student-font-poppins " : ""}${
        light
          ? "min-h-screen overflow-x-clip bg-[#f3f7fd]"
          : "app-canvas min-h-screen overflow-x-clip"
      }`}
    >
      <Sidebar navItems={navItems} variant={variant} student={student} />

      <MobileNav
        open={mobileNavOpen}
        onClose={closeMobileNav}
        navItems={navItems}
        student={student}
      />

      <div className={light ? "lg:pl-[220px]" : "lg:pl-[264px]"}>
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileNavOpen(true)}
          variant={variant}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          notificationCount={notificationCount}
          showHome={showHome}
          showRole={showRole}
        />

        <main
          className={
            mainClassName ||
            (light
              ? "mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-6 lg:py-6"
              : "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8")
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
