import { useRef, useEffect } from 'react';

export const NeuralBackground = ({ isDark }: { isDark: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        let animationFrameId: number;

        const initParticles = () => {
            particles = [];
            const count = Math.floor((width * height) / 25000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const particleColor = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(71, 85, 105, 0.15)';
            const lineColor = isDark ? 'rgba(148, 163, 184, 0.05)' : 'rgba(71, 85, 105, 0.08)';

            ctx.fillStyle = particleColor;
            ctx.strokeStyle = lineColor;

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 14400) { // 120 * 120
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener('resize', handleResize);
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
