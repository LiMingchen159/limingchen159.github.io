import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ToyCityProps {
    rotation?: [number, number, number];
}

export const ToyCity = ({ rotation = [0, 0, 0] }: ToyCityProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // Pastel color palette for buildings
    const colors = [
        0xFF9AA2, 0xFFB7B2, 0xFFDAC1,
        0xE2F0CB, 0xB5EAD7, 0xC7CEEA
    ];

    // Create plastic material
    const createPlasticMaterial = (color: number) => {
        return new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 1.0
        });
    };

    // Generate city layout
    const cityElements = useMemo(() => {
        const elements: React.ReactElement[] = [];
        const gridSize = 12;
        const unitSize = 2;
        const offset = (gridSize * unitSize) / 2 - unitSize / 2;

        let buildingKey = 0;

        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const posX = x * unitSize - offset;
                const posZ = z * unitSize - offset;
                const rand = Math.random();
                const isEdge = x === 0 || x === gridSize - 1 || z === 0 || z === gridSize - 1;

                if (!isEdge && rand > 0.4) {
                    // Building
                    const height = Math.random() * 4 + 1.5;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const speed = Math.random() * 0.002 + 0.001;
                    const phaseOffset = Math.random() * Math.PI * 2;

                    elements.push(
                        <group key={`building-${buildingKey++}`} position={[posX, height / 2, posZ]}>
                            <RoundedBox
                                args={[1.4, height, 1.4]}
                                radius={0.25}
                                smoothness={4}
                                castShadow
                                receiveShadow
                            >
                                <primitive object={createPlasticMaterial(color)} attach="material" />
                            </RoundedBox>
                            {/* Animated floating data */}
                            <mesh
                                userData={{
                                    speed,
                                    offset: phaseOffset,
                                    type: 'building'
                                }}
                                visible={false}
                            />
                        </group>
                    );

                    // Roof decoration
                    if (Math.random() > 0.7) {
                        elements.push(
                            <mesh key={`roof-${buildingKey}`} position={[posX, height + 0.2, posZ]} castShadow>
                                <sphereGeometry args={[0.5, 16, 16]} />
                                <primitive object={createPlasticMaterial(color)} attach="material" />
                            </mesh>
                        );
                    }
                } else if (rand > 0.2 || isEdge) {
                    // Tree
                    if (Math.random() > 0.5) {
                        elements.push(
                            <group key={`tree-${buildingKey++}`}>
                                <mesh position={[posX, 0.5, posZ]} castShadow receiveShadow>
                                    <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
                                    <meshStandardMaterial color={0x8B5A2B} />
                                </mesh>
                                <mesh position={[posX, 1.2, posZ]} castShadow>
                                    <sphereGeometry args={[0.8, 32, 32]} />
                                    <primitive object={createPlasticMaterial(0x88D8B0)} attach="material" />
                                </mesh>
                            </group>
                        );
                    }
                }
            }
        }

        // Add clouds
        for (let i = 0; i < 5; i++) {
            const cloudSpeed = Math.random() * 0.01 + 0.005;
            const cloudMat = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transmission: 0.2,
                opacity: 0.9,
                transparent: true,
                roughness: 0.1,
                clearcoat: 1.0
            });

            elements.push(
                <group
                    key={`cloud-${i}`}
                    position={[
                        (Math.random() - 0.5) * 20,
                        8 + Math.random() * 4,
                        (Math.random() - 0.5) * 20
                    ]}
                    userData={{ speed: cloudSpeed, type: 'cloud' }}
                >
                    <mesh>
                        <sphereGeometry args={[1, 16, 16]} />
                        <primitive object={cloudMat} attach="material" />
                    </mesh>
                    <mesh position={[0.8, 0.2, 0]} scale={[0.8, 0.8, 0.8]}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <primitive object={cloudMat} attach="material" />
                    </mesh>
                    <mesh position={[-0.8, 0.1, 0]} scale={[0.7, 0.7, 0.7]}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <primitive object={cloudMat} attach="material" />
                    </mesh>
                </group>
            );
        }

        return elements;
    }, []);

    // Animation - minimal floating
    useFrame(() => {
        if (groupRef.current) {

            // Animate buildings and clouds
            groupRef.current.children.forEach((child) => {
                if (child.userData.type === 'cloud') {
                    child.position.x += child.userData.speed;
                    if (child.position.x > 15) child.position.x = -15;
                }
            });
        }
    });

    return (
        <group ref={groupRef} scale={0.12} rotation={rotation}>
            {/* Base platform */}
            <RoundedBox
                args={[24, 1, 24]}
                radius={0.5}
                smoothness={8}
                position={[0, -0.5, 0]}
                receiveShadow
            >
                <meshPhysicalMaterial
                    color={0xf5f5f5}
                    roughness={0.5}
                    clearcoat={0.3}
                />
            </RoundedBox>

            {/* City elements */}
            {cityElements}
        </group>
    );
};
