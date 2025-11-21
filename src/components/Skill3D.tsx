import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, Float, SpotLight, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';
import { Clapperboard } from './models/Clapperboard';
import { RLogo } from './models/RLogo';
import { SunToy } from './models/SunToy';
import { LightningToy } from './models/LightningToy';
import { ToyCity } from './models/ToyCity';
import { KnowledgeGraph } from './models/KnowledgeGraph';

interface Skill3DProps {
    modelPath: string;
    isActive: boolean;
    color: string;
}

// Component for standard GLTF models
const GltfModel = ({ modelPath }: { modelPath: string }) => {
    const { scene } = useGLTF(modelPath);
    const isPython = modelPath.includes('python');

    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    // Apply consistent material properties
                    if (mesh.material instanceof THREE.MeshStandardMaterial) {
                        // Python model: Shiny plastic look
                        // Others: Standard metallic/glossy look
                        mesh.material.roughness = isPython ? 0.2 : 0.3;
                        mesh.material.metalness = isPython ? 0.1 : 0.3;
                    }
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }
            }
        });
        return clone;
    }, [scene]);

    // Adjust transform based on model type
    const scale = isPython ? 0.35 : 0.25;
    const position: [number, number, number] = isPython ? [0, 0.3, -0.1] : [0, 0.3, 0];
    const rotation: [number, number, number] = isPython ? [-Math.PI / 10, 0, 0] : [3 * Math.PI / 10, 0, 0];

    return (
        <primitive
            object={clonedScene}
            scale={scale}
            position={position}
            rotation={rotation}
        />
    );
};

// Component for OBJ/MTL models (Roller)
const ObjModel = () => {
    const materials = useLoader(MTLLoader, '/models/Roller/10514_Inline_Skates_L3.mtl');
    const obj = useLoader(OBJLoader, '/models/Roller/10514_Inline_Skates_L3.obj', (loader) => {
        materials.preload();
        (loader as any).setMaterials(materials);
    });

    const clonedScene = useMemo(() => {
        const clone = obj.clone();
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const oldMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

                if (oldMat) {
                    // Create a new Standard material for better PBR glossiness
                    const newMat = new THREE.MeshStandardMaterial({
                        color: (oldMat as any).color || new THREE.Color(0xffffff),
                        map: (oldMat as any).map || null,
                        metalness: 0.3,
                        roughness: 0.3,
                        envMapIntensity: 2.0
                    });

                    mesh.material = newMat;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }
            }
        });
        return clone;
    }, [obj]);

    return (
        <primitive
            object={clonedScene}
            scale={0.1}
            position={[0, -0.6, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
        />
    );
};

export const Skill3D = ({ modelPath, isActive, color }: Skill3DProps) => {
    const isCustomModel = modelPath === 'clapperboard';
    const isRLogo = modelPath === 'rlanguage';
    const isSunToy = modelPath === 'suntoy';
    const isLightningToy = modelPath === 'lightningtoy';
    const isToyCity = modelPath === 'toycity';
    const isKnowledgeGraph = modelPath === 'knowledgegraph';
    const isObjModel = modelPath.includes('Roller');
    const meshRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (meshRef.current) {
            // Gentle rotation around Y axis (turntable effect)
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group>
            {/* Spotlight from above */}
            <SpotLight
                position={[0, 5, 0]}
                angle={0.3}
                penumbra={0.5}
                intensity={isActive ? 2 : 0.5}
                castShadow
                color={color}
                distance={10}
            />

            {/* Floating Model */}
            <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={0.5}
                floatingRange={[0.5, 1]}
            >
                {/* Group for Y-axis rotation (turntable) */}
                <group ref={meshRef}>
                    {isCustomModel ? (
                        <group position={[0, 0.5, 0]} rotation={[- Math.PI / 10, 0, 0]}>
                            <Clapperboard />
                        </group>
                    ) : isRLogo ? (
                        <group position={[0, 0.5, 0]}>
                            <RLogo rotation={[-Math.PI / 8, 0, 0]} />
                        </group>
                    ) : isSunToy ? (
                        <group position={[0, 0.5, 0]}>
                            <SunToy rotation={[-Math.PI / 6, 0, 0]} />
                        </group>
                    ) : isLightningToy ? (
                        <group position={[0, 0.2, 0]}>
                            <LightningToy rotation={[0, 0, -0.2]} />
                        </group>
                    ) : isToyCity ? (
                        <group position={[0, -0.15, 0]}>
                            <ToyCity rotation={[0, 0, 0]} />
                        </group>
                    ) : isKnowledgeGraph ? (
                        <group position={[0, 0.7, 0]}>
                            <KnowledgeGraph rotation={[0, 0, 0]} />
                        </group>
                    ) : isObjModel ? (
                        <ObjModel />
                    ) : (
                        <GltfModel modelPath={modelPath} />
                    )}
                </group>
            </Float>

            {/* Platform */}
            <Cylinder args={[1.2, 1.2, 0.2, 32]} position={[0, -0.5, 0]} receiveShadow>
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Platform Glow */}
            <pointLight position={[0, -0.4, 0]} intensity={1} color={color} distance={2} />
        </group>
    );
};
