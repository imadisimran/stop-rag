import React from 'react'

export function ProfileLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-secondary/20 border-b-secondary animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>
            <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary animate-pulse">
                    Connecting to Security Node...
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">
                    DECRYPTING USER IDENTITY CORE
                </p>
            </div>
        </div>
    )
}
