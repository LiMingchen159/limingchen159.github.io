import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { MousePointer2 } from 'lucide-react';

export const ArchitectureScene = ({ isDark }: { isDark: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const towerRef = useRef<THREE.Group | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);

    const isDragging = useRef(false);
    const previousMouse = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(isDark ? 0x0a0a0a : 0xe8e8e8, 12, 25);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(7, 5, 7);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Tower group
        const towerGroup = new THREE.Group();
        towerRef.current = towerGroup;
        scene.add(towerGroup);

        // Create Modern Skyscraper with setback design
        const createSkyscraper = () => {
            const sections = [
                { floors: 18, width: 2.4, depth: 1.8 },  // Base section (wide)
                { floors: 22, width: 1.8, depth: 1.4 },  // Middle section (narrower)
                { floors: 16, width: 1.2, depth: 1.0 },  // Top section (slim)
            ];

            let currentY = -5; // Lower position for better framing
            const floorHeight = 0.15;

            sections.forEach((section) => {
                const { floors, width, depth } = section;
                const sectionHeight = floors * floorHeight;

                // Create solid faces to prevent seeing through
                const solidMaterial = new THREE.MeshBasicMaterial({
                    color: isDark ? 0x0a0a0a : 0xf5f5f5,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: isDark ? 0.85 : 0.95,
                });

                const boxGeo = new THREE.BoxGeometry(width, sectionHeight, depth);
                const solidBox = new THREE.Mesh(boxGeo, solidMaterial);
                solidBox.position.y = currentY + sectionHeight / 2;
                towerGroup.add(solidBox);

                // Vertical edges (4 corners)
                const corners = [
                    [-width / 2, -depth / 2],
                    [width / 2, -depth / 2],
                    [width / 2, depth / 2],
                    [-width / 2, depth / 2],
                ];

                corners.forEach(([x, z]) => {
                    const points = [];
                    for (let i = 0; i <= floors; i++) {
                        points.push(new THREE.Vector3(x, currentY + i * floorHeight, z));
                    }
                    const edgeGeo = new THREE.BufferGeometry().setFromPoints(points);
                    const edge = new THREE.Line(edgeGeo, new THREE.LineBasicMaterial({
                        color: isDark ? 0x00ffff : 0xff6b35,
                        transparent: true,
                        opacity: isDark ? 0.8 : 0.9,
                    }));
                    towerGroup.add(edge);
                });

                // Horizontal floors (every 2 floors)
                for (let f = 0; f <= floors; f += 2) {
                    const y = currentY + f * floorHeight;

                    // Floor outline
                    const floorPoints = [
                        new THREE.Vector3(-width / 2, y, -depth / 2),
                        new THREE.Vector3(width / 2, y, -depth / 2),
                        new THREE.Vector3(width / 2, y, depth / 2),
                        new THREE.Vector3(-width / 2, y, depth / 2),
                        new THREE.Vector3(-width / 2, y, -depth / 2),
                    ];
                    const floorGeo = new THREE.BufferGeometry().setFromPoints(floorPoints);
                    const floor = new THREE.Line(floorGeo, new THREE.LineBasicMaterial({
                        color: isDark ? 0x00ffff : 0xff6b35,
                        transparent: true,
                        opacity: isDark ? 0.6 : 0.7,
                    }));
                    towerGroup.add(floor);
                }

                // Vertical facade grid (glass curtain wall pattern)
                const verticalLines = 6;
                for (let i = 0; i < verticalLines; i++) {
                    const t = i / (verticalLines - 1);

                    // Front and back faces
                    const xPos = -width / 2 + t * width;
                    ['front', 'back'].forEach((face) => {
                        const zPos = face === 'front' ? -depth / 2 : depth / 2;
                        const points = [];
                        for (let f = 0; f <= floors; f++) {
                            points.push(new THREE.Vector3(xPos, currentY + f * floorHeight, zPos));
                        }
                        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
                            color: isDark ? 0x00ffff : 0xff6b35,
                            transparent: true,
                            opacity: isDark ? 0.4 : 0.5,
                        }));
                        towerGroup.add(line);
                    });

                    // Left and right faces
                    const zPos = -depth / 2 + t * depth;
                    ['left', 'right'].forEach((face) => {
                        const xPos = face === 'left' ? -width / 2 : width / 2;
                        const points = [];
                        for (let f = 0; f <= floors; f++) {
                            points.push(new THREE.Vector3(xPos, currentY + f * floorHeight, zPos));
                        }
                        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({
                            color: isDark ? 0x00ffff : 0xff6b35,
                            transparent: true,
                            opacity: isDark ? 0.4 : 0.5,
                        }));
                        towerGroup.add(line);
                    });
                }

                currentY += sectionHeight;
            });
        };

        createSkyscraper();

        // Add particle light effects
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleData: { angle: number; radius: number; height: number; speed: number }[] = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 2;
            const height = (Math.random() - 0.5) * 6;

            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = height;
            particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

            particleData.push({
                angle,
                radius,
                height,
                speed: 0.3 + Math.random() * 0.5
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: isDark ? 0x66ddff : 0xff8c42,
            size: isDark ? 0.08 : 0.12,
            transparent: true,
            opacity: isDark ? 0.8 : 0.9,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particlesRef.current = particles;
        scene.add(particles);

        // Add point lights following particles
        const lights: THREE.PointLight[] = [];
        for (let i = 0; i < 8; i++) {
            const light = new THREE.PointLight(
                isDark ? 0x66ddff : 0xff6b35,
                isDark ? 1.5 : 2.0,
                isDark ? 5 : 6
            );
            lights.push(light);
            scene.add(light);
        }

        // Interaction
        const canvas = renderer.domElement;

        const onMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            previousMouse.current = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const deltaX = e.clientX - previousMouse.current.x;
            targetRotation.current.y += deltaX * 0.005;
            previousMouse.current = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging.current = false;
            canvas.style.cursor = 'grab';
        };

        const onMouseLeave = () => {
            isDragging.current = false;
            canvas.style.cursor = 'grab';
        };

        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseleave', onMouseLeave);
        canvas.style.cursor = 'grab';

        // Animation
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);

            if (!isDragging.current) {
                targetRotation.current.y += 0.002;
            }

            if (towerRef.current) {
                towerRef.current.rotation.y += (targetRotation.current.y - towerRef.current.rotation.y) * 0.05;
            }

            // Animate particles
            if (particlesRef.current) {
                const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
                const time = Date.now() * 0.001;

                for (let i = 0; i < particleCount; i++) {
                    const data = particleData[i];
                    data.angle += data.speed * 0.01;

                    positions[i * 3] = Math.cos(data.angle) * data.radius;
                    positions[i * 3 + 1] = data.height + Math.sin(time + i * 0.1) * 0.3;
                    positions[i * 3 + 2] = Math.sin(data.angle) * data.radius;
                }

                particlesRef.current.geometry.attributes.position.needsUpdate = true;

                // Update point lights to follow some particles
                lights.forEach((light, i) => {
                    const particleIndex = i * 12;
                    light.position.set(
                        positions[particleIndex * 3],
                        positions[particleIndex * 3 + 1],
                        positions[particleIndex * 3 + 2]
                    );
                });
            }

            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width && height) {
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('mouseleave', onMouseLeave);

            if (rendererRef.current && containerRef.current?.contains(rendererRef.current.domElement)) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }

            particleGeometry.dispose();
            particleMaterial.dispose();
            renderer.dispose();
        };
    }, [isDark]);

    return (
        <div className="relative w-full h-full group">
            <div ref={containerRef} className="w-full h-full overflow-hidden" />
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${isDark ? 'text-teal-300' : 'text-slate-500'}`}>
                <MousePointer2 size={10} />
                <span>Drag to Rotate</span>
            </div>
        </div>
    );
};
