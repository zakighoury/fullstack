// hooks/hook.ts

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../lib/store';

// Create a typed version of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Create a typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
