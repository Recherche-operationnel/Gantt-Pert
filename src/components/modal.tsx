import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
         <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;