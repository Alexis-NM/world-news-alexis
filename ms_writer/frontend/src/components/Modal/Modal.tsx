import { useEffect, useCallback } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function Modal({ isOpen, onClose, title, message, type }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-type={type} role="document">
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
        </header>
        <p className={styles.message}>{message}</p>
        <footer className={styles.footer}>
          <button className={styles.button} onClick={onClose} autoFocus>
            Compris
          </button>
        </footer>
      </div>
    </div>
  );
}
