const Layout = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={[className, "max-w-[1440px] min-w-[320px] px-12 py-8"].join(" ")}>{children}</div>
);

export default Layout;
