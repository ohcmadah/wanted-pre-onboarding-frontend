import { useState } from "react";

type Name = string;
type Value = React.InputHTMLAttributes<HTMLInputElement>["value"];
type Validator = (value: Value) => boolean;

export const useForm = (initialValues: Record<Name, Value>, validators?: Record<Name, Validator>) => {
  const [values, setValues] = useState(initialValues);

  const getValidator = (name: Name) => validators && validators[name];
  const [errors, setErrors] = useState<Record<Name, boolean>>(
    Object.entries(initialValues).reduce((acc, [name, initialValue]) => {
      const validator = getValidator(name);
      if (typeof validator === "function" && !validator(initialValue)) {
        return { ...acc, [name]: false };
      }
      return acc;
    }, {})
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validator = getValidator(name);
    if (typeof validator === "function") {
      if (validator(value)) {
        const { [name]: _, ...newErrors } = errors;
        setErrors(newErrors);
      } else {
        setErrors({ ...errors, [name]: false });
      }
    }
    setValues({ ...values, [name]: value });
  };

  return { values, errors, onChange };
};
