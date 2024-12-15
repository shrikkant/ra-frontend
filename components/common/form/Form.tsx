

import React from "react";

interface FormProps {
  children: React.ReactNode;
}


export default function Form({ children }: FormProps) {
  return (<div className="w-full max-w-lg m-auto">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {children}
    </form>
  </div>)
}
