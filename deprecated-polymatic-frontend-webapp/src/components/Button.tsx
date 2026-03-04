import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'
import { Button as ShadcnButton } from '@/components/ui/button'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantMap: Record<ButtonVariant, 'default' | 'secondary' | 'ghost' | 'destructive'> = {
  primary: 'default',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'destructive',
}

const sizeMap: Record<ButtonSize, 'sm' | 'default' | 'lg'> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        variant={variantMap[variant]}
        size={sizeMap[size]}
        disabled={disabled || loading}
        className={cn(className)}
        {...props}
      >
        {loading && <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />}
        {children}
      </ShadcnButton>
    )
  },
)

Button.displayName = 'Button'
