import { ChangeEvent } from "react";

function Logo() {
  return (
    <figure className="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
      <img src="src\assets\queex4.png"></img>
    </figure>
  );
}

function InputEmail({
  email,
  onChange,
}: {
  email: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-md font-medium leading-6 text-slate-50 pl-2"
      >
        Usuaria/o
      </label>
      <div className="mt-2">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={onChange}
          className="block w-full rounded-md border-0 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-teal-300 placeholder:text-white bg-blackInput focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-md sm:leading-7"
        />
      </div>
    </div>
  );
}

function InputPassword({
  password,
  onChange,
}: {
  password: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor="password"
          className="block text-md font-medium leading-6 text-slate-50 pl-2"
        >
          Contraseña
        </label>
      </div>
      <div className="mt-2">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={onChange}
          className="block w-full rounded-md border-0 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-teal-300 placeholder:text-white bg-blackInput focus:ring-3 focus:ring-inset focus:ring-teal-600 sm:text-md sm:leading-7"
        />
      </div>
    </div>
  );
}

function ButtonSumbit() {
  return (
    <div>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-celadon px-3 py-1.5 text-md font-semibold leading-6 text-gunMetal shadow-sm hover:bg-teal-600  sm:leading-7 mt-12"
      >
        Ingresa
      </button>
    </div>
  );
}

function IconsFood() {
  return (
    <div>
      <figure className="pt-10 mx-auto h-15 w-auto">
        <img src="src\assets\icons_food.png"></img>
      </figure>
    </div>
  );
}

export { Logo, InputEmail, InputPassword, ButtonSumbit, IconsFood };
