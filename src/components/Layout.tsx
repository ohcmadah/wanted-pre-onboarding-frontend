const Layout = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={[className, "max-w-[1024px] min-w-[320px] px-12 py-8 mx-auto"].join(" ")}>{children}</div>
);

export default Layout;
