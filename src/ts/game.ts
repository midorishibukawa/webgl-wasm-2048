// const WebGL = await import('three/examples/jsm/capabilities/WebGL');
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { initDrawing, generateMeshes, render } from './renderer';

const GAME_SIZE= 4;
const swipe = {
    x: null,
    y: null,
};

enum GameState {
    DEFAULT,
    WIN,
    LOSS
}

let i = false;
export const init = async () => {
    if (!WebGL.isWebGLAvailable) {
        console.log('WebGL is not available!');
        return;
    } 
    if (i) return;
    i = true;
    const wasm = await import('../../pkg/wasm_2048');
    const Game = wasm.Game;
    const Direction = wasm.Direction;
    const memory = (await import('../../pkg/wasm_2048_bg.wasm')).memory;
    const MOVEMENT_KEYS = new Map([
        ['ArrowUp',     Direction.Up    ],
        ['KeyW',        Direction.Up    ],
        ['KeyK',        Direction.Up    ],
        ['ArrowDown',   Direction.Down  ],
        ['KeyS',        Direction.Down  ],
        ['KeyJ',        Direction.Down  ],
        ['ArrowLeft',   Direction.Left  ],
        ['KeyA',        Direction.Left  ],
        ['KeyH',        Direction.Left  ],
        ['ArrowRight',  Direction.Right ],
        ['KeyD',        Direction.Right ],
        ['KeyL',        Direction.Right ],
    ]);

    const game = new Game(GAME_SIZE);
    
    const gameState = GameState.DEFAULT;

    game.generate();

    const cells = Array.from(new Uint8Array(memory.buffer, game.cells, GAME_SIZE * GAME_SIZE));

    initDrawing();

    generateMeshes(cells);
    
    const m = move(MOVEMENT_KEYS)(game)(gameState)(memory);
    document.addEventListener('keydown', (key) => m(key));
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', (e) => handleTouchMove(m)(e));
}

const move = MOVEMENT_KEYS => game => gameState => memory => key => {
    if (key.code.startsWith('Arrow')) key.preventDefault();
    if (gameState == GameState.LOSS) return;
    let dir = MOVEMENT_KEYS.get(key.code);
    if (dir == null) return;
    game.move_cells(dir, true);
    const cells = Array.from(new Uint8Array(memory.buffer, game.cells, GAME_SIZE * GAME_SIZE));
    generateMeshes(cells);
    if (gameState != GameState.WIN && game.is_game_win) window.requestAnimationFrame(gameWin);
    if (game.is_game_over) window.requestAnimationFrame(gameOver);
}

const gameWin = () => {
    console.log("YOU WON!");
}

const gameOver = () => {
    console.log("YOU LOSS!")
}


const handleTouchStart = e => {
    const firstTouch = e.touches[0];                                      
    [swipe.x, swipe.y] = [firstTouch.clientX, firstTouch.clientY];
};                                                
                                                                         
const handleTouchMove = move => e => {
    if (!swipe.x || !swipe.y) return;
    
    const delta = {
        x: swipe.x - e.touches[0].clientX,
        y: swipe.y - e.touches[0].clientY,
    };

    move(getDir(delta));

    render();
    
    [swipe.x, swipe.y] = [null, null];
};

const getDir = delta => {
    return {
        code: Math.abs(delta.x) > Math.abs(delta.y)
            ? delta.x > 0 ? 'ArrowLeft' : 'ArrowRight'
            : delta.y > 0 ? 'ArrowUp'   : 'ArrowDown',
        preventDefault: () => {}
    }
}
