import React from 'react'

export function ProfileError({fetchProfile, err}: {fetchProfile: () => void, err: string}) {
  return (
   <div className="max-w-md mx-auto relative bg-white/[0.02] border border-destructive/20 backdrop-blur-[10px] p-6 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.05)] text-center space-y-6 my-12">
        <div className="inline-flex p-3.5 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive mb-1">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-white uppercase tracking-tight">Decryption Failed</h2>
          <p className="font-mono text-[9px] text-destructive uppercase tracking-widest">
            ERROR_CODE: NODE_DECRYPTION_ERROR
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">{err}</p>
        </div>
        <button
          onClick={fetchProfile}
          className="w-full py-2.5 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive hover:text-white rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
  )
}
