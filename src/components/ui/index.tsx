/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
  className?: string;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/10",
    secondary: "bg-primary-light text-white hover:bg-primary-light/90",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "h-10 w-10 p-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = "", hover = false }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-black/5 ${
        hover ? "hover:shadow-md transition-shadow duration-300" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-text-muted mr-1">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  size?: "sm" | "md";
}

export const ProgressBar = ({
  value,
  max,
  label,
  color = "bg-primary",
  size = "md",
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full flex flex-col gap-2">
      {(label || value !== undefined) && (
        <div className="flex justify-between text-sm">
          {label && <span className="font-medium text-text-muted">{label}</span>}
          <span className="font-bold text-primary">
            {value} / {max}
          </span>
        </div>
      )}
      <div
        className={`w-full bg-black/5 rounded-full overflow-hidden ${
          size === "sm" ? "h-1.5" : "h-3"
        }`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
