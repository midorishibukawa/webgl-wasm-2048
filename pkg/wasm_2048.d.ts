/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
/**
*/
export class Game {
  free(): void;
/**
* @param {number} s
*/
  constructor(s: number);
/**
*/
  generate(): void;
/**
* @param {number} dir
* @param {boolean} gen
*/
  move_cells(dir: number, gen: boolean): void;
/**
* @returns {number}
*/
  readonly cells: number;
/**
* @returns {boolean}
*/
  readonly is_game_over: boolean;
/**
* @returns {boolean}
*/
  readonly is_game_win: boolean;
}
