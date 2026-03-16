import { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalContextType {
    isResumeOpen: boolean;
    openResume: () => void;
    closeResume: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const openResume = () => {
        setIsResumeOpen(true);
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeResume = () => {
        setIsResumeOpen(false);
        // Restore background scrolling
        document.body.style.overflow = 'auto';
    };

    return (
        <ModalContext.Provider value={{ isResumeOpen, openResume, closeResume }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
