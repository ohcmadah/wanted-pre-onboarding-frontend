export const Background = ({
  className,
  onClose,
  children,
}: {
  className?: string;
  onClose?: React.MouseEventHandler<HTMLDivElement>;
  children: React.ReactNode;
}) => (
  <div
    className={[
      "fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center bg-gray-600/60",
      className,
    ].join(" ")}
    onClick={(evt) => {
      if (evt.target === evt.currentTarget) {
        onClose && onClose(evt);
      }
    }}
  >
    {children}
  </div>
);

const Popup = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <Background onClose={onClose}>
    <section className="rounded-md border border-gray-400 drop-shadow bg-white mx-12 w-full max-w-[500px] min-w-[280px]">
      <article className="p-5 flex justify-between text-lg font-medium">
        <span>{title}</span>
        <button className="px-3 text-gray-600 hover:opacity-70" onClick={onClose}>
          X
        </button>
      </article>
      <div className="bg-gray-400 h-px rounded" />
      <article className="px-5 py-7 min-h-[200px]">{children}</article>
    </section>
  </Background>
);

export default Popup;
