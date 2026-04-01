import { create } from "zustand";

const useAnalysisStore = create((set) => ({
  // state
  loading: false,
  result: null,        // full backend response
  error: null,

  // actions
  startAnalysis: () =>
    set({
      loading: true,
      error: null,
    }),

  setResult: (data) =>{
    set({
      result: data,
      loading: false,
      error: null,
    })},

  setError: (err) =>
    set({
      error: err,
      loading: false,
    }),

  resetAnalysis: () =>
    set({
      loading: false,
      result: null,
      error: null,
    }),
}));

export default useAnalysisStore;
