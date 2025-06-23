import styles from './button.module.css';

export const Button = ({ label = "", onClick = () => {}, icon = null, className = "" }: { label?: string, onClick?: () => void, icon?: React.ReactNode, className?: string }) => {
  return (
    <button role="button" className={`${styles.button} ${className}`} onClick={onClick}>
      {icon ?? null}
      {label ?? null}
    </button>
  )
}


