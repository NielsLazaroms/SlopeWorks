import { tv, type VariantProps } from 'tailwind-variants';

export const sectionTitleVariants = tv({
  base: '',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    shadow: {
      true: 'shadow-lg'
    },
    showUnderLine: {
      true: 'underline underline-offset-3'
    }
  }
})
