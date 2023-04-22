import { useEffect, useRef, useState } from "react"

export function lerp(v1: number, v2: number, t: number): number {
    return (1 - t) * v1 + t * v2
}

export function useAnimatedT() {
    const [t, setT] = useState(0)
    const animationRef = useRef<number>()
    const startTimestampRef = useRef<number>();

    function animate(time: DOMHighResTimeStamp) {
        if (!startTimestampRef.current) { //set start time
            startTimestampRef.current = time;
        }
        const elapsed = time - startTimestampRef.current;
        const newT = (Math.sin(elapsed / 100) + 1) / 2;
        setT(newT)
        animationRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        };
    }, [])

    return t
}

export function useCurrentTime() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [])

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedTime = hours + ':' + minutes;

    return formattedTime
}