import { ApiState, FetchApiAction } from './types';

export function apiReducer<A extends unknown[], T>(
  state: ApiState<A, T>,
  action: FetchApiAction<A, T>
): ApiState<A, T> {
  switch (action.type) {
    case 'FETCH_API_START':
      return {
        isLoading: true,
      };
    case 'FETCH_API_SUCCEED':
      return {
        isLoading: false,
        data: action.payload,
        fetchArgs: action.fetchArgs,
      };
    case 'FETCH_API_FAILED':
      return {
        isLoading: false,
        error: action.error,
        fetchArgs: action.fetchArgs,
      };
    default:
      return state;
  }
}
