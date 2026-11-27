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
  contentVariant,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const light = variant === "light";
  const { user } = useAuth();
  const student = user?.role === "student";
  const admin = user?.role === "admin";
  const trainer = user?.role === "trainer";
  const lightStaffWorkspace = admin || trainer;
  const lightContent =
    lightStaffWorkspace || (contentVariant || variant) === "light";
  const sidebarPadding =
    student || light || admin || trainer
      ? "lg:pl-[220px]"
      : "lg:pl-[264px]";
  const keepStudentBackground = student && title === "Overview";

  return (
    <div
      className={`${
        student
          ? `student-font-poppins ${
              keepStudentBackground ? "student-image-background " : ""
            }`
          : ""
      }${
        light || lightStaffWorkspace
          ? "min-h-screen overflow-x-clip bg-[#f3f7fd]"
          : "app-canvas min-h-screen overflow-x-clip"
      }`}
    >
      <Sidebar
        navItems={navItems}
        variant={variant}
        student={student}
        admin={admin}
        trainer={trainer}
      />

      <MobileNav
        open={mobileNavOpen}
        onClose={closeMobileNav}
        navItems={navItems}
        student={student}
        admin={admin}
        trainer={trainer}
      />

      <div
        className={`${sidebarPadding} ${
          lightStaffWorkspace ? "staff-workspace" : ""
        }`}
      >
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileNavOpen(true)}
          variant={
            lightStaffWorkspace || light || contentVariant === "light"
              ? "light"
              : variant
          }
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          notificationCount={notificationCount}
          showHome={showHome}
          showRole={showRole}
        />

        <div
          className={
            lightStaffWorkspace || (!light && lightContent)
              ? "min-h-[calc(100vh-4rem)] bg-[#f3f7fd]"
              : undefined
          }
        >
          <main
            className={
              mainClassName ||
              (lightStaffWorkspace
                ? "mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
                : contentVariant === "light" && !light
                ? "mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
                : light
                  ? "mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-6 lg:py-6"
                  : "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8")
            }
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
