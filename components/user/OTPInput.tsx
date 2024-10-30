import React, { useState, useRef } from 'react';

interface OTPInputProps {
  onChange: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move focus to the next input if a digit was entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // If backspace is pressed, move focus to the previous input
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex  gap-x-2 justify-center py-4 w-full">
      {otp.map((_, index) => (
        <input
          key={index}
          type="tel"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="rounded-md focus:border-[#E5C71F]"
          style={{
            width: '50px',
            height: '50px',
            textAlign: 'center',
            fontSize: '18px',
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
