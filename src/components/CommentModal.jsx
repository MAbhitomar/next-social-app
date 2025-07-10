"use client";

import { useModal } from "@/context/ModalContext";

export default function CommentModal() {
  const { open, setOpen } = useModal();

  return (
    <div>
      <h1>Comment Modal</h1>
      {open && <div>Modal is open</div>}
    </div>
  );
}
