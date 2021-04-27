import * as yup from "yup";

const regSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  username: yup.string().required(),
  password: yup.string().required(),
  passwordConfirm: yup.string().required(),
});

export { regSchema };
