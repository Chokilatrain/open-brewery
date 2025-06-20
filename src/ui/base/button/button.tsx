

export const Button = ({ label = "", onClick = () => {}, icon = null, className = "" }: { label?: string, onClick?: () => void, icon?: React.ReactNode, className?: string }) => {
  return (
    <button role="button" className={`bg-blue-500 text-white p-2 rounded-md ${className}`} onClick={onClick}>
      {icon ?? null}
      {label ?? null}
    </button>
  )
}


