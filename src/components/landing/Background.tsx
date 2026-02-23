import { Dithering } from '@paper-design/shaders-react';
import { themeStore } from '@/lib/themeStore';
import { useStore } from '@nanostores/react';
import { useMemo, useState } from 'react';
import { formatHex, parse } from 'culori';
import { useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';

function oklchToHex(value: string): string {
    const trimmed = value.trim();
    const color = parse(trimmed);
    if (!color) return '#000000';
    return formatHex(color) ?? '#000000';
}

export const Background: React.FC = () => {
    const [time, setTime] = useState(0)
    const [scrollOffset, setScrollOffset] = useState(0)

    const theme = useStore(themeStore)
    const { back, front } = useMemo(() => {
        // Get foreground colors and background colors from CSS
        const backgroundColorFront = oklchToHex(getComputedStyle(document.body).getPropertyValue('--background'));
        const backgroundColorBack = oklchToHex(getComputedStyle(document.body).getPropertyValue('--muted'));
        return {
            back: backgroundColorFront,
            front: backgroundColorBack
        }
    }, [theme])

    const { scrollY } = useScroll()

    useAnimationFrame((time, delta) => {
        setTime(t => t + delta)
    })

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setScrollOffset(latest)
    })

    return (
        <Dithering
            frame={time + scrollOffset * 2}
            className='absolute inset-0'
            colorBack={back}
            colorFront={front}
            shape="warp"
            type="8x8"
            size={3.5}
            speed={0.1}
            minPixelRatio={1}
        />
    )
}