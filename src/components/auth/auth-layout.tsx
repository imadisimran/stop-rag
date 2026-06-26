export function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <div className="w-full max-w-md">
        <div className="glass-elevated p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
