import { tv, type VariantProps } from 'tailwind-variants';

export const sectionTitleVariants = tv({
  base: '',
  variants: {
    size: {
      sm: 'text-2xl',
      md: 'text-4xl',
      lg: 'text-6xl',
    },
    fontWeight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    shadow: {
      true: 'text-shadow-lg'
    },
    showUnderLine: {
      true: 'underline underline-offset-12'
    },
    textPosition: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    textColor: {
      primary: 'text-brand-500',
      secondary: 'text-gray-500',
      dark: 'text-gray-900',
      light: 'text-white',
    },
    underlineColor: {
      primary: 'decoration-brand-500',
      secondary: 'decoration-gray-500',
      dark: 'decoration-gray-900',
      light: 'decoration-white',
    },
    textStroke: {
      none: '',
      sm: '[-webkit-text-stroke:0.3px_black]',
      md: '[-webkit-text-stroke:0.5px_black]',
      lg: '[-webkit-text-stroke:1px_black]',
      white: '[-webkit-text-stroke:0.5px_white]',
    }
  },
  defaultVariants: {
    size: 'md',
    fontWeight: 'bold',
    shadow: false,
    showUnderLine: false,
    textPosition: 'left',
    textColor: 'dark',
    underlineColor: 'primary',
    stroke: 'none'
  }
})
export type SectionTitleVariants = VariantProps<typeof sectionTitleVariants>;
