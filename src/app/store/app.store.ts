import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { initialState } from './app.state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, of, pipe, switchMap, tap } from 'rxjs';
import { ErrorState, LoadingState } from '../constants/loading-state';
import { HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';
import { FILTERS_KEYS } from '../constants/filters';

export const AppStore = signalStore({ providedIn: 'root' },
  withState(initialState),
  withComputed(store => ({
    filteredFiles: computed(() => {
      let files = [...store.selectedFileData()];

      if (store.filters().isHideSmallValues) {
        files = files.filter(file => file.value >= 30);
      }

      if (store.filters().isAlphabeticSort) {
        files.sort((a, b) => a.category.localeCompare(b.category));
      }

      return files;
    }),
    isLoading: computed(() => store.callState() === LoadingState.LOADING),
    isLoaded: computed(() => store.callState() === LoadingState.LOADED),
    error: computed(() => (store.callState() as ErrorState).errorMsg),
  })),
  withMethods(store => {
      const loadFiles = rxMethod<{ name: string, data: { category: string, value: number }[] }>(
        pipe(
          tap(() => patchState(store, { callState: LoadingState.LOADING })),
          switchMap((payload) => of([])
            .pipe(
              delay(1000),
              tapResponse({
                next: () => {
                  const updatedFiles = [
                    {
                      name: payload.name,
                      date: new Date().toLocaleString(),
                      data: payload.data
                    },
                    ...store.files(),
                  ].slice(0, 5);

                  patchState(
                    store, {
                      selectedFileData: payload.data,
                      files: updatedFiles,
                      callState: LoadingState.LOADED,
                    },
                  );
                },
                error: (error: HttpErrorResponse) => patchState(store, { callState : { errorMsg: error.statusText } }),
              }),
            ),
          ),
        ),
      );

    const setFilter = (filterKey: FILTERS_KEYS) => {
      patchState(store, { filters: { ...store.filters(), [filterKey]: !store.filters()[filterKey] } });
    };

    const selectFileFromHistory = (data: { category: string, value: number }[]) => {
      patchState(store, { selectedFileData: data });
    };

    return {
      loadFiles,
      setFilter,
      selectFileFromHistory,
    };
  }),
);
