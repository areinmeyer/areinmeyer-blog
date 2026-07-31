'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSelector() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-9 h-9" />
    }

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark')
        else if (theme === 'dark') setTheme('system')
        else setTheme('light')
    }

    const getIcon = () => {
        if (theme === 'light') return '🌞'
        if (theme === 'dark') return '🌙'
        return '💻'
    }

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            {getIcon()}
        </button>
    )
}