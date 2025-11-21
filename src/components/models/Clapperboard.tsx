import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Clapperboard = () => {
    const groupRef = useRef<THREE.Group>(null);
    const stickGroupRef = useRef<THREE.Group>(null);
    const [isClapping, setIsClapping] = useState(false);
    const [clapState, setClapState] = useState<'idle' | 'closing' | 'opening'>('idle');

    // Dimensions
    const boardWidth = 8;
    const boardHeight = 6;
    const boardThickness = 0.2;
    const stickHeight = 1.2;

    // Materials
    const materials = useMemo(() => ({
        black: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.3 }),
        white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.3 }),
        metal: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.8 }) // Keep metal slightly more metallic but match roughness
    }), []);

    // Text Texture
    const textTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 1024, 512);
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const startX = 50;
            const startY = 50;
            const lineHeight = 100;

            ctx.fillText("PROD.  SCENE     TAKE", startX, startY);
            ctx.beginPath(); ctx.moveTo(startX, startY + 50); ctx.lineTo(950, startY + 50); ctx.stroke();

            ctx.fillText("DIRECTOR", startX, startY + lineHeight);
            ctx.save();
            ctx.font = 'italic bold 60px "Brush Script MT", cursive, sans-serif';
            ctx.fillText("Mingchen Li", startX + 240, startY + lineHeight - 10);
            ctx.restore();
            ctx.beginPath(); ctx.moveTo(startX, startY + lineHeight + 50); ctx.lineTo(950, startY + lineHeight + 50); ctx.stroke();

            ctx.fillText("CAMERA", startX, startY + lineHeight * 2);
            ctx.beginPath(); ctx.moveTo(startX, startY + lineHeight * 2 + 50); ctx.lineTo(950, startY + lineHeight * 2 + 50); ctx.stroke();

            ctx.fillText("DATE            Day  Night", startX, startY + lineHeight * 3);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Stripe Texture
    const stripeTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, 512, 128);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            const stripeSize = 60;
            for (let x = -128; x < 512; x += stripeSize * 2) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x + stripeSize, 0);
                ctx.lineTo(x + stripeSize - 60, 128);
                ctx.lineTo(x - 60, 128);
                ctx.closePath();
            }
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Animation Logic
    useFrame(() => {
        if (stickGroupRef.current) {
            if (clapState === 'closing') {
                stickGroupRef.current.rotation.z -= 0.15;
                if (stickGroupRef.current.rotation.z <= 0) {
                    stickGroupRef.current.rotation.z = 0;
                    setClapState('opening');
                }
            } else if (clapState === 'opening') {
                stickGroupRef.current.rotation.z += 0.04;
                if (stickGroupRef.current.rotation.z >= THREE.MathUtils.degToRad(20)) {
                    stickGroupRef.current.rotation.z = THREE.MathUtils.degToRad(20);
                    setClapState('idle');
                    setIsClapping(false);
                }
            }
        }
    });

    const triggerClap = () => {
        if (!isClapping) {
            setIsClapping(true);
            setClapState('closing');
        }
    };

    return (
        <group ref={groupRef} onClick={triggerClap} scale={0.2}>
            {/* Main Board */}
            <mesh material={materials.black} position={[0, -boardHeight / 2 + 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[boardWidth, boardHeight, boardThickness]} />
            </mesh>

            {/* Text Area */}
            <mesh position={[0, -1, boardThickness / 2 + 0.01]}>
                <planeGeometry args={[boardWidth - 1, boardHeight - 2]} />
                <meshStandardMaterial map={textTexture} />
            </mesh>

            {/* Top Static Bar */}
            <group position={[0, stickHeight / 2 + 0.5, 0]}>
                <mesh material={materials.black}>
                    <boxGeometry args={[boardWidth, stickHeight, boardThickness]} />
                </mesh>
                <mesh position={[0, 0, boardThickness / 2 + 0.011]}>
                    <planeGeometry args={[boardWidth, stickHeight]} />
                    <meshBasicMaterial map={stripeTexture} />
                </mesh>
                <mesh position={[0, 0, -boardThickness / 2 - 0.011]} rotation={[0, Math.PI, 0]}>
                    <planeGeometry args={[boardWidth, stickHeight]} />
                    <meshBasicMaterial map={stripeTexture} />
                </mesh>
            </group>

            {/* Hinge Group (Pivot) */}
            <group ref={stickGroupRef} position={[-boardWidth / 2, stickHeight + 0.5, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(20)]}>
                {/* Stick Group (Offset) */}
                <group position={[boardWidth / 2, stickHeight / 2, 0]}>
                    <mesh material={materials.black} castShadow receiveShadow>
                        <boxGeometry args={[boardWidth, stickHeight, boardThickness]} />
                    </mesh>

                    {/* Stripes on Stick */}
                    <mesh position={[0, 0, boardThickness / 2 + 0.011]}>
                        <planeGeometry args={[boardWidth, stickHeight]} />
                        <meshBasicMaterial map={stripeTexture} />
                    </mesh>
                    <mesh position={[0, 0, -boardThickness / 2 - 0.011]} rotation={[0, Math.PI, 0]}>
                        <planeGeometry args={[boardWidth, stickHeight]} />
                        <meshBasicMaterial map={stripeTexture} />
                    </mesh>
                </group>

                {/* Hinge Decor */}
                <mesh material={materials.metal} position={[0, 0.5, boardThickness / 2 + 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
                </mesh>
            </group>
        </group>
    );
};
