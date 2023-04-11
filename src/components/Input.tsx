const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={[props.className, "border border-gray-400 rounded-md py-3 px-4"].join(" ")} />
);

export default Input;
