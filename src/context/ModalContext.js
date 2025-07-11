"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState("");
  return (
    <ModalContext.Provider value={{ open, setOpen, postId, setPostId }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
