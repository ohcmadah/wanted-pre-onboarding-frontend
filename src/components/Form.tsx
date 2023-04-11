type FormProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  onSubmit: (values: Record<string, string>) => any;
};

const Form = (props: FormProps) => (
  <form
    {...props}
    onSubmit={(e) => {
      e.preventDefault();
      const inputs = document.getElementsByTagName("input");
      const values = Array.from(inputs).reduce((acc, input) => {
        const { name } = input;
        return { ...acc, [name]: e.currentTarget[name].value };
      }, {});
      props.onSubmit(values);
    }}
  >
    {props.children}
  </form>
);

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className={[props.className, "font-medium block mb-1"].join(" ")}></label>
);

export default Object.assign(Form, { Label: Label });
