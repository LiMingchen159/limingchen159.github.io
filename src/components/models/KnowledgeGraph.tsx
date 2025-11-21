import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface KnowledgeGraphProps {
    rotation?: [number, number, number];
}

export const KnowledgeGraph = ({ rotation = [0, 0, 0] }: KnowledgeGraphProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // Toy colors palette
    const colors = [
        0xFF6B6B, 0x4ECDC4, 0xFFD93D,
        0x6A0572, 0xFF9A8B, 0x95E1D3
    ];

    const config = {
        nodeCount: 25,
        connectionChance: 0.5,
        nodeSize: 1.2,
        edgeRadius: 0.08
    };

    // Create plastic material
    const createPlasticMaterial = (color: number) => {
        return new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            sheen: 0.5,
            reflectivity: 0.5,
            side: THREE.DoubleSide
        });
    };

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        metalness: 0.1,
        roughness: 0.4,
        clearcoat: 0.5
    });

    // Generate node positions and connections
    const graphData = useMemo(() => {
        const nodes: Array<{ position: THREE.Vector3; color: number; scale: number; rotation: [number, number, number] }> = [];
        const edges: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];

        // Generate nodes
        const positions: THREE.Vector3[] = [];
        for (let i = 0; i < config.nodeCount; i++) {
            const radius = 8;
            const phi = Math.acos(-1 + (2 * i) / config.nodeCount);
            const theta = Math.sqrt(config.nodeCount * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi) + (Math.random() - 0.5) * 2;
            const y = radius * Math.sin(theta) * Math.sin(phi) + (Math.random() - 0.5) * 2;
            const z = radius * Math.cos(phi) + (Math.random() - 0.5) * 2;

            const position = new THREE.Vector3(x, y, z);
            positions.push(position);

            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const scale = config.nodeSize * (0.8 + Math.random() * 0.6);
            const rotation: [number, number, number] = [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ];

            nodes.push({ position, color: randomColor, scale, rotation });
        }

        // Generate edges
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const distance = positions[i].distanceTo(positions[j]);

                let probability = config.connectionChance;
                if (distance > 8) probability = 0;
                if (distance < 4) probability += 0.3;

                if (Math.random() < probability) {
                    edges.push({ start: positions[i].clone(), end: positions[j].clone() });
                }
            }
        }

        return { nodes, edges };
    }, []);

    // Animation
    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.getElapsedTime();

            // Animate nodes with floating effect
            groupRef.current.children.forEach((child, idx) => {
                if (child.userData.type === 'node') {
                    child.position.y += Math.sin(time * 1.5 + idx) * 0.002;
                }
            });
        }
    });

    return (
        <group ref={groupRef} scale={0.15} rotation={rotation}>
            {/* Nodes */}
            {graphData.nodes.map((node, idx) => (
                <RoundedBox
                    key={`node-${idx}`}
                    args={[1, 1, 1]}
                    radius={0.25}
                    smoothness={8}
                    position={node.position}
                    rotation={node.rotation}
                    scale={node.scale}
                    castShadow
                    receiveShadow
                    userData={{ type: 'node', originalY: node.position.y }}
                >
                    <primitive object={createPlasticMaterial(node.color)} attach="material" />
                </RoundedBox>
            ))}

            {/* Edges */}
            {graphData.edges.map((edge, idx) => {
                const distance = edge.start.distanceTo(edge.end);
                const center = new THREE.Vector3().addVectors(edge.start, edge.end).multiplyScalar(0.5);

                // Calculate rotation to align cylinder with edge
                const direction = new THREE.Vector3().subVectors(edge.end, edge.start).normalize();
                const axis = new THREE.Vector3(0, 1, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
                const euler = new THREE.Euler().setFromQuaternion(quaternion);

                return (
                    <mesh
                        key={`edge-${idx}`}
                        position={center}
                        rotation={euler}
                        castShadow
                        receiveShadow
                    >
                        <cylinderGeometry args={[config.edgeRadius, config.edgeRadius, distance, 8]} />
                        <primitive object={edgeMaterial} attach="material" />
                    </mesh>
                );
            })}
        </group>
    );
};
