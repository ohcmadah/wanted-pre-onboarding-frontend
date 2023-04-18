import Button from "./Button";
import Input from "./Input";

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

const Email = ({ value, onChange }: Pick<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <>
    <Label htmlFor="email">이메일</Label>
    <Input
      type="text"
      value={value}
      onChange={onChange}
      className="mb-5"
      name="email"
      id="email"
      data-testid="email-input"
    />
  </>
);

const Password = ({ value, onChange }: Pick<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <>
    <Label htmlFor="password">비밀번호</Label>
    <Input
      type="password"
      value={value}
      onChange={onChange}
      name="password"
      id="password"
      data-testid="password-input"
    />
  </>
);

const Submit = (props: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">) => (
  <Button
    {...props}
    type="submit"
    className={[
      "bg-primary text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed",
      props.className,
    ].join(" ")}
  >
    {props.children}
  </Button>
);

export default Object.assign(Form, { Label: Label, Email: Email, Password: Password, Submit: Submit });
