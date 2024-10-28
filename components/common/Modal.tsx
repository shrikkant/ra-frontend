import React, { useEffect, ReactNode } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-content')) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="modal-overlay fixed  bg-opacity-75 bg-gray-500 h-screen w-screen left-0 top-0 z-10" aria-hidden="true"></div>
      <div className=" fixed inset-0 w-screen overflow-y-auto h-screen left-0 top-0 z-10">
        <div className="modal-content flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 z-10">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm xs:w-full z-10">
            <div className="border border-[#FFDC2DAD]">
              <div>
                <div className=" border-b-[#FFDC2DAD] border-b">
                  <h1 className="p-4  text-gray-900  text-2xl" id="modal-title">
                    {title}
                  </h1>
                </div>
                <div className="p-4">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
