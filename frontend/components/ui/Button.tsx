import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export default function Button({ variant = "primary", className, ...rest }: Props) {
  const base = "py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
  const v =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primaryDark focus:ring-primary/50"
      : variant === "danger"
      ? "bg-danger text-white hover:bg-red-700 focus:ring-red-300"
      : "bg-transparent text-primary border border-primary hover:bg-primary/10 focus:ring-primary/25";

  return <button className={clsx(base, v, className)} {...rest} />;
}
