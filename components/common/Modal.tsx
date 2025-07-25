import React, {useEffect, ReactNode} from 'react'
import {createPortal} from 'react-dom'

interface ModalProps {
  show: boolean
  onClose: () => void
  children: ReactNode
  title: string
  logoTitle?: boolean
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  children,
  logoTitle = false,
}) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.classList.contains('modal-content')) {
        onClose()
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [show, onClose])

  if (!show) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-overlay fixed bg-opacity-75 bg-gray-500 h-screen w-screen left-0 top-0"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 w-screen overflow-y-auto h-screen left-0 top-0">
        <div className="modal-content flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm w-full mx-4">
            <div className="border border-[#FFDC2DAD]">
              <div>
                <div className="border-b-[#FFDC2DAD] border-b relative">
                  {logoTitle ? (
                    <div className="p-4 flex justify-center items-center pr-12">
                      <img
                        src="/assets/v2/img/logo.png"
                        alt="Logo"
                        className="h-8 w-auto p-1"
                      />
                    </div>
                  ) : (
                    <h1
                      className="p-4 text-gray-900 text-xl m-auto text-center font-semibold pr-12"
                      id="modal-title"
                    >
                      {title}
                    </h1>
                  )}
                  <button
                    onClick={onClose}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
