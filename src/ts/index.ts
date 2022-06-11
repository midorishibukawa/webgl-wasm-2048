import WebGL from 'three/examples/jsm/capabilities/WebGL';
import * as THREE from 'three';
import { MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial } from 'three';
import { Painter, initDrawing, generateMeshes, render, onWindowResize } from './renderer';
import { Game } from '../../pkg/wasm_2048';
import { game_cells } from '../../pkg/wasm_2048_bg.wasm';

const GAME_SIZE = 4;

enum GameState {
    DEFAULT,
    WIN,
    LOSS
}

const init = async () => {
    if (!WebGL.isWebGLAvailable) {
        console.log('WebGL is not available!');
        return;
    }
    const wasm = await import('../../pkg/wasm_2048');
    const memory = (await import('../../pkg/wasm_2048_bg.wasm')).memory;

    const Direction = wasm.Direction
    const game = new wasm.Game(GAME_SIZE);
    
    const movementKeys = [
        {
            keys: ['ArrowUp',     'KeyW', 'KeyK'],
            dir : Direction.Left,
        }, {
            keys: ['ArrowDown',   'KeyS', 'KeyJ'],
            dir: Direction.Right
        }, {
            keys: ['ArrowLeft',   'KeyA', 'KeyH'],
            dir: Direction.Down,
        }, {
            keys:  ['ArrowRight',  'KeyD', 'KeyL'],
            dir: Direction.Up,
        }
    ];

    const gameState = GameState.DEFAULT;

    game.generate();

    const cells = Array.from(new Uint8Array(memory.buffer, game.cells, GAME_SIZE * GAME_SIZE));

    initDrawing();

    generateMeshes(cells);
    document.addEventListener('keydown', (key) => move(movementKeys)(game)(gameState)(memory)(key));
    document.addEventListener('touchmove', (e) => handleTouchMove(game)(Direction)(e));
}

const move = movementKeys => game => gameState => memory => key => {
    if (gameState == GameState.LOSS) return;
    if (key.code.startsWith('Arrow')) key.preventDefault();
    let dir = movementKeys.filter(e => e.keys.includes(key.code)).map(e => e.dir);
    if (dir.length == 0) return;
    game.move_cells(dir[0], true);
    const cells = Array.from(new Uint8Array(memory.buffer, game.cells, GAME_SIZE * GAME_SIZE));
    generateMeshes(cells);
    if (gameState != GameState.WIN && game.is_game_win) window.requestAnimationFrame(gameWin);
    if (game.is_game_over) window.requestAnimationFrame(gameOver);
}

const gameWin = gameState => {
    gameState = GameState.WIN;
    console.log("YOU WON!");
}

const gameOver = gameState => {
    gameState = GameState.LOSS;
    console.log("YOU LOSS!")
}

const swipe = {
    x: null,
    y: null,
};

const handleTouchStart = e => {
    const firstTouch = e.touches[0];                                      
    [swipe.x, swipe.y] = [firstTouch.clientX, firstTouch.clientY];
};                                                
                                                                         
const handleTouchMove = game => Direction => e => {
    if (!swipe.x || !swipe.y) return;
    
    const delta = {
        x: swipe.x - e.touches[0].clientX,
        y: swipe.y - e.touches[0].clientY,
    };
    
    game.move_cells(getDir(Direction)(delta));
    
    render();
    
    [swipe.x, swipe.y] = [null, null];
};

const getDir = Direction => delta => {
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
        return delta.x > 0 ? Direction.Left : Direction.Right;
    } else {
        return delta.y > 0 ? Direction.Up : Direction.Down;
    }
}

init();
