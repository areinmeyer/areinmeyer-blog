'use client'

import { ThemeProvider as BlogThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <BlogThemesProvider {...props}>{children}</BlogThemesProvider>
}