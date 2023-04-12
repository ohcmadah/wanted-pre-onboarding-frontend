const Form = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form
    {...props}
    onSubmit={(e) => {
      e.preventDefault();
      props.onSubmit && props.onSubmit(e);
    }}
  >
    {props.children}
  </form>
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className={[props.className, "font-medium block mb-1"].join(" ")}></label>
);

export default Object.assign(Form, { Label: Label });
