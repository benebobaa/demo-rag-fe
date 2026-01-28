import { useEffect, useRef, useState } from "react"

export interface UseInViewOptions {
    rootMargin?: string
    threshold?: number | number[]
    once?: boolean
}

export function useInView<T extends HTMLElement>(options: UseInViewOptions = {}) {
    const { rootMargin = "0px 0px -10% 0px", threshold = 0.2, once = true } = options
    const ref = useRef<T | null>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        if (prefersReducedMotion) {
            setInView(true)
            return
        }

        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    if (once) observer.disconnect()
                } else if (!once) {
                    setInView(false)
                }
            },
            { rootMargin, threshold }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [rootMargin, threshold, once])

    return { ref, inView }
}
