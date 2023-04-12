const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={[props.className, "py-4 px-6 rounded-md min-w-[120px]"].join(" ")}>
    {props.children}
  </button>
);

export default Button;
