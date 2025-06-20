export const MenuItem = ({ label, onClick, icon = null }: { label: string, onClick: () => void, icon?: React.ReactNode }) => {
  return (
    <li key={label} role="menuitem" onMouseDown={onClick} className="px-4 cursor-pointer hover:bg-gray-100">
      {icon ?? null}
      {label ?? null}
    </li>
  )
}


