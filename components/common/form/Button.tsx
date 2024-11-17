
import React from 'react';

interface ButtonProps {
  label: string | undefined;
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean | undefined;
}

const Button: React.FC<ButtonProps> = ({ label, variant, onClick, disabled }: ButtonProps) => {
  const primaryColor = 'bg-[#FFDC2DAD]';
  const secondaryColor = '#374151';

  const styles = {
    // backgroundColor: variant === 'primary' ? primaryColor : secondaryColor,
    color: variant === 'primary' ? '#555' : '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
  } as React.CSSProperties;

  return (
    <button style={styles} onClick={onClick}
      className={`w-full px-4 ${(variant === 'primary' && !disabled) ? primaryColor : secondaryColor}
      ${disabled ? `bg-gray-400 cursor-default` : `cursor-pointer hover:bg-[#E5C71F]`} py-2 rounded-md text-[#555] font-semibold`}>
      {label ? label : 'Submit'}
    </button>
  );
};

export default Button;
