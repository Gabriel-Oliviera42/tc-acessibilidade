import React from 'react';
import { motion, AnimatePresence } from "motion/react";

export default function ChatPanel({ children, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-panel"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 30,
            mass: 0.8
          }}
          className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-surface rounded-xl shadow-xl border border-gray-200 flex flex-col glass-effect"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
