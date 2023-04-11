export const emailValidator = (email: any) => {
  if (typeof email !== "string") {
    return false;
  }
  return email.includes("@");
};

export const passwordValidator = (password: any) => {
  if (typeof password !== "string") {
    return false;
  }
  return password.length >= 8;
};
