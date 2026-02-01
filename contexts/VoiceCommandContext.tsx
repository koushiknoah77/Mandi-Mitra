import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { SupportedLanguageCode } from '../types';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { getLabel } from '../utils/translations';

export interface VoiceCommand {
    id: string;
    keywords: string[]; // Keywords in the current language
    callback: (transcript: string) => void;
    description: string;
}

interface VoiceCommandContextType {
    registerCommand: (command: VoiceCommand) => void;
    unregisterCommand: (id: string) => void;
    voiceState: any; // Using any for simplicity as it matches VoiceState type
    startGlobalListen: () => Promise<string | null>;
    stopGlobalListen: () => void;
    matchedCommandId: string | null;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const VoiceCommandProvider: React.FC<{ children: React.ReactNode; language: SupportedLanguageCode }> = ({ children, language }) => {
    const [commands, setCommands] = useState<VoiceCommand[]>([]);
    const { state: voiceState, listen, cancel } = useVoiceAssistant(language);
    const [matchedCommandId, setMatchedCommandId] = useState<string | null>(null);

    const registerCommand = useCallback((command: VoiceCommand) => {
        setCommands(prev => {
            const filtered = prev.filter(c => c.id !== command.id);
            return [...filtered, command];
        });
    }, []);

    const unregisterCommand = useCallback((id: string) => {
        setCommands(prev => prev.filter(c => c.id !== id));
    }, []);

    const startGlobalListen = async (): Promise<string | null> => {
        setMatchedCommandId(null);
        const transcript = await listen();

        if (transcript) {
            const normalizedTranscript = transcript.toLowerCase().trim();

            // Try to find a matching command
            let foundCommand: VoiceCommand | null = null;

            // 1. Exact or include match
            foundCommand = commands.find(cmd =>
                cmd.keywords.some(kw => {
                    const normalizedKw = kw.toLowerCase().trim();
                    return normalizedTranscript === normalizedKw ||
                        normalizedTranscript.includes(normalizedKw) ||
                        normalizedKw.includes(normalizedTranscript);
                })
            ) || null;

            if (foundCommand) {
                setMatchedCommandId(foundCommand.id);
                foundCommand.callback(transcript);
                setTimeout(() => setMatchedCommandId(null), 2000);
                return null; // Handled by command
            }

            return transcript; // Return for local handling
        }
        return null;
    };

    return (
        <VoiceCommandContext.Provider value={{
            registerCommand,
            unregisterCommand,
            voiceState,
            startGlobalListen,
            stopGlobalListen: cancel,
            matchedCommandId
        }}>
            {children}
        </VoiceCommandContext.Provider>
    );
};

export const useVoiceCommands = () => {
    const context = useContext(VoiceCommandContext);
    if (!context) {
        throw new Error('useVoiceCommands must be used within a VoiceCommandProvider');
    }
    return context;
};

// Hook for components to register commands easily
export const useRegisterVoiceCommand = (command: VoiceCommand | null) => {
    const { registerCommand, unregisterCommand } = useVoiceCommands();

    useEffect(() => {
        if (command) {
            registerCommand(command);
            return () => unregisterCommand(command.id);
        }
    }, [command, registerCommand, unregisterCommand]);
};

export const useRegisterVoiceCommands = (commands: VoiceCommand[]) => {
    const { registerCommand, unregisterCommand } = useVoiceCommands();

    useEffect(() => {
        commands.forEach(cmd => registerCommand(cmd));
        return () => {
            commands.forEach(cmd => unregisterCommand(cmd.id));
        };
    }, [commands, registerCommand, unregisterCommand]);
};
