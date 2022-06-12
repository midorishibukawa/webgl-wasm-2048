import * as THREE from "three";
import { Mesh, MeshBasicMaterial, PositionalAudio } from "three";
import { Game } from "../../pkg/wasm_2048";

export type Painter = {
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
}

const painter: Painter = {
    renderer: new THREE.WebGLRenderer({ antialias: true }),
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight, 0.1, 1000
    )
}

export const initDrawing = () => {
    painter.renderer.setClearColor(0xffffff);
    painter.renderer.setPixelRatio(window.devicePixelRatio)
        
    painter.renderer.setSize(window.innerWidth, window.innerHeight);

    painter.camera.position.z = 8;

    document.body.appendChild(painter.renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

export const onWindowResize = () => {
    painter.renderer.setSize(window.innerWidth, window.innerHeight);
    painter.camera.aspect = window.innerWidth / window.innerHeight;
    painter.camera.updateProjectionMatrix();
}

const animate = cellMap => {

    requestAnimationFrame(() => animate(cellMap));

    
    cellMap.forEach(cell => {
        cell.rotation.x += .001;
        cell.rotation.y += .001;
        cell.rotation.z += .001;
    });

    render();
}

export const render = () => {
    painter.renderer.render(painter.scene, painter.camera);
}

export const generateMeshes = (cells: number[]) => {
    const colorMap = new Map();
    const cellMap = new Map();

    colorMap.set(0,     0xffffff);
    colorMap.set(1,     0xd4fffd);
    colorMap.set(2,     0xc8f7fe);
    colorMap.set(3,     0xbbe8fe);
    colorMap.set(4,     0xafd6fd);
    colorMap.set(5,     0xa4bffb);
    colorMap.set(6,     0x98a4fa);
    colorMap.set(7,     0x938df8);
    colorMap.set(8,     0x9e82f6);
    colorMap.set(9,     0xac77f4);
    colorMap.set(10,    0xbe6df1);
    colorMap.set(11,    0xd262ef);
    colorMap.set(12,    0xe958ec);
    colorMap.set(13,    0xe84fcf);
    colorMap.set(14,    0xe545ad);
    colorMap.set(15,    0xe13c89);
    colorMap.set(16,    0xdd3363);
    colorMap.set(17,    0xf564b6);

    painter.scene.children = [];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = cells[i * 4 + j];
            if (cell == 0) {
                continue;
            }
            const boxGeometry = new THREE.BoxGeometry();
            const material = new MeshBasicMaterial();
            // const material = new MeshPhysicalMaterial({
            //     color: colorMap.get(cell),
            //     metalness: .1,
            //     roughness: .05,
            //     ior: 2.5,
            //     transmission: 1,
            //     side: THREE.DoubleSide
            // });
            
            // const material = new MeshPhongMaterial({
                // color: colorMap.get(cell),
                // emissive: colorMap.get(cell),
                // side: THREE.DoubleSide,
                // })

                // const material = new MeshLambertMaterial({
                //     color: colorMap.get(cell),
                //     side: THREE.DoubleSide,
                //     wireframe: true,
                // })
                
            material.transparent = true;
            material.reflectivity = 1;
            
            material.color.setHex(colorMap.get(cell));

            const cube = new THREE.Mesh(boxGeometry, material);
            cube.position.x = -1.5 * i + 2.25;
            cube.position.y = -1.5 * j + 2.25;
            cellMap.set(i * 4 + j, cube);
            painter.scene.children.push(cube);
        }
    }

    animate(cellMap);

    return painter;
}
