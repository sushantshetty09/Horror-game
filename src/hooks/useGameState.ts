import { useEffect, useMemo, useReducer } from 'react';
import {
  completeJumpscare,
  createInitialState,
  startGame,
  submitCode,
  switchQuality,
  tickFrame,
  updateEnteredCode,
} from '../game/GameEngine';
import type { GameState, QualityLevel } from '../types';

type Action =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'SWITCH_QUALITY'; quality: QualityLevel }
  | { type: 'END_JUMPSCARE' }
  | { type: 'SET_CODE'; value: string }
  | { type: 'SUBMIT_CODE' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return startGame(state);
    case 'TICK':
      return tickFrame(state);
    case 'SWITCH_QUALITY':
      return switchQuality(state, action.quality);
    case 'END_JUMPSCARE':
      return completeJumpscare(state);
    case 'SET_CODE':
      return updateEnteredCode(state, action.value);
    case 'SUBMIT_CODE':
      return submitCode(state);
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    if (state.phase !== 'PLAYING' && state.phase !== 'JUMPSCARE') return;

    const id = window.setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 50);

    return () => window.clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== 'JUMPSCARE') return;
    const id = window.setTimeout(() => dispatch({ type: 'END_JUMPSCARE' }), 2000);
    return () => window.clearTimeout(id);
  }, [state.phase]);

  const actions = useMemo(
    () => ({
      start: () => dispatch({ type: 'START' }),
      switchQuality: (quality: QualityLevel) => dispatch({ type: 'SWITCH_QUALITY', quality }),
      setCode: (value: string) => dispatch({ type: 'SET_CODE', value }),
      submitCode: () => dispatch({ type: 'SUBMIT_CODE' }),
    }),
    [],
  );

  return { state, actions };
}
