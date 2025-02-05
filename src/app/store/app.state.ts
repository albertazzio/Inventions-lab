import { CallState, LoadingState } from '../constants/loading-state';

export interface AppState {
  files: { name: string; date: string, data: { category: string, value: number }[] }[];
  selectedFileData: { category: string, value: number }[];
  filters: {
    isAlphabeticSort: boolean;
    isHideSmallValues: boolean;
  }
  callState: CallState;
}

export const initialState: AppState = {
  files: [],
  selectedFileData: [],
  filters: {
    isAlphabeticSort: false,
    isHideSmallValues: false,
  },
  callState: LoadingState.INIT,
};
