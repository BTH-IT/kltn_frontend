import React from 'react';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  buttonType?: 'primary' | 'default' | 'secondary';
}

const Button = ({
  children,
  className,
  buttonType = 'default',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`p-2 text-sm rounded-md transition-all duration-300 ${className} hover:bg-slate-100 ${
        buttonType === 'primary'
          ? 'text-blue-700 hover:bg-blue-100 font-semibold'
          : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
