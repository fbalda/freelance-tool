import { useState } from "react";
import { useForm } from "react-hook-form";
import { Divider, TextInputGroup } from "./formElements";

export interface LoginCredentials {
  username?: string;
  password?: string;
  totp?: string;
}

const LoginForm = (props: {
  totpStep: boolean;
  onSubmit: (data: LoginCredentials) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const [disabled, setDisabled] = useState(false);

  const onSubmit = (data: LoginCredentials) => {
    setDisabled(true);

    props.onSubmit(data).finally(() => setDisabled(false));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={disabled}>
        {!props.totpStep ? (
          <>
            <TextInputGroup
              label="Username"
              field="username"
              type="text"
              placeholder=""
              rules={{ minLength: 5, maxLength: 60, required: true }}
              register={register}
              errors={errors}
            />

            <TextInputGroup
              label="Password"
              field="password"
              type="password"
              placeholder=""
              rules={{ minLength: 4, maxLength: 60, required: true }}
              register={register}
              errors={errors}
            />
          </>
        ) : (
          <TextInputGroup
            label="Totp"
            field="totp"
            type="text"
            placeholder=""
            rules={{ minLength: 5, maxLength: 60, required: true }}
            register={register}
            errors={errors}
          />
        )}
        <Divider />
        <div className="submit">
          <button className="button w-full" type="submit">
            Login
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default LoginForm;
