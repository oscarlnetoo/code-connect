type DividerProps = {
  children: string
}

export function Divider({ children }: DividerProps) {
  return (
    <div role="separator" className="flex items-center gap-4 text-sm text-gray">
      <span className="h-px flex-1 bg-gray/40" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-gray/40" />
    </div>
  )
}
