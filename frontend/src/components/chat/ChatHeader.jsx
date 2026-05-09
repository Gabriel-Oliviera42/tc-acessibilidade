import React from 'react';
import { X, Robot } from "@phosphor-icons/react";

export default function ChatHeader({ onClose }) {
  return (
    <div className="bg-primary p-4 rounded-t-xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <Robot size={16} weight="regular" className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white font-heading">Assistente IA</h3>
          <p className="text-xs text-white text-opacity-90 font-body">Acessibilidade WCAG</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
      >
        <X size={20} weight="regular" className="text-white" />
      </button>
    </div>
  );
}
