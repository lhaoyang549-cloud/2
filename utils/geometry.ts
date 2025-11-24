import * as THREE from 'three';

// Helper to get a random point on a sphere surface
export const getSpherePoint = (radius: number = 2): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Helper to get a random point on a cube surface
export const getCubePoint = (size: number = 3): THREE.Vector3 => {
  const half = size / 2;
  // Pick a random face: 0=x+, 1=x-, 2=y+, 3=y-, 4=z+, 5=z-
  const face = Math.floor(Math.random() * 6);
  const u = (Math.random() * 2 - 1) * half;
  const v = (Math.random() * 2 - 1) * half;
  
  switch (face) {
    case 0: return new THREE.Vector3(half, u, v);
    case 1: return new THREE.Vector3(-half, u, v);
    case 2: return new THREE.Vector3(u, half, v);
    case 3: return new THREE.Vector3(u, -half, v);
    case 4: return new THREE.Vector3(u, v, half);
    case 5: return new THREE.Vector3(u, v, -half);
    default: return new THREE.Vector3(0, 0, 0);
  }
};

// Helper to get a random point on a square pyramid surface
export const getPyramidPoint = (size: number = 3.5, height: number = 3.5): THREE.Vector3 => {
  // Pyramid with square base centered at y = -height/2, tip at y = height/2
  // We have 5 faces: 1 base, 4 sides.
  // Approximate surface area distribution for uniform sampling
  
  const face = Math.random();
  const halfBase = size / 2;
  const yBase = -height / 3;
  const yTip = height * 2/3;

  // Simple sampling: Randomly pick base or sides
  // 20% chance for base, 80% for sides (approx)
  if (face < 0.2) {
    // Base
    return new THREE.Vector3(
      (Math.random() * 2 - 1) * halfBase,
      yBase,
      (Math.random() * 2 - 1) * halfBase
    );
  } else {
    // Triangle sides. 
    // We can sample a triangle by picking two random numbers.
    // Side 1 (Front): Tip(0, yTip, 0), BL(-h, yBase, h), BR(h, yBase, h) ... simplified logic:
    // Lerp between tip and a random point on the base perimeter
    
    // Random point on base perimeter
    let bx, bz;
    const side = Math.floor(Math.random() * 4);
    const t = Math.random() * 2 - 1; // -1 to 1 along edge
    
    if (side === 0) { bx = t * halfBase; bz = halfBase; } // Front edge
    else if (side === 1) { bx = halfBase; bz = t * halfBase; } // Right edge
    else if (side === 2) { bx = t * halfBase; bz = -halfBase; } // Back edge
    else { bx = -halfBase; bz = t * halfBase; } // Left edge

    // Interpolate from tip to this base point
    const r = Math.sqrt(Math.random()); // Sqrt for uniform distribution on triangle
    
    const x = bx * r;
    const z = bz * r;
    const y = yTip + (yBase - yTip) * r;
    
    return new THREE.Vector3(x, y, z);
  }
};

export const getTorusPoint = (radius: number = 2, tube: number = 0.8): THREE.Vector3 => {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    
    const x = (radius + tube * Math.cos(v)) * Math.cos(u);
    const y = (radius + tube * Math.cos(v)) * Math.sin(u);
    const z = tube * Math.sin(v);
    
    return new THREE.Vector3(x, y, z);
}
