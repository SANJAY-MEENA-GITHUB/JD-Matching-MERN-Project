// import { create } from "zustand";

// const useAnalysisStore = create((set) => ({
//   // ----------------------------
//   // STATE
//   // ----------------------------

//   loading: false,

//   result:JSON.parse(localStorage.getItem("analysisResult")) || null,

//   error: null,

//   preparationPlan: null,

//   resources: null,

//   technicalQuestions: null,

//   behavioralQuestions: null,

//   // ----------------------------
//   // ACTIONS
//   // ----------------------------

//   startAnalysis: () =>
//     set({
//       loading: true,
//       error: null,
//     }),

//   setResult: (data) => {
//     localStorage.setItem(
//       "analysisResult",
//       JSON.stringify(data)
//     );

//     set({
//       result: data,
//       loading: false,
//       error: null,
//     });
//   },

//   setPreparationPlan: (data) =>
//     set({
//       preparationPlan: data,
//     }),

//   setResources: (data) =>
//     set({
//       resources: data,
//     }),

//   setTechnicalQuestions: (data) =>
//     set({
//       technicalQuestions: data
//     }),

//   setBehavioralQuestions: (data) =>
//   set({
//     behavioralQuestions: data
//   }),

//   setError: (err) =>
//     set({
//       error: err,
//       loading: false,
//     }),

//   resetAnalysis: () => {
//     localStorage.removeItem("analysisResult");
//     set({
//       loading: false,
//       result: null,
//       error: null,
//       preparationPlan: null,
//       resources: null,
//       technicalQuestions: null,
//       behavioralQuestions: null,
//     });
//   },
// }));

// export default useAnalysisStore;




import { create } from "zustand";

let initialResult = null;

try {
  const stored = localStorage.getItem("analysisResult");

  if (stored && stored !== "undefined") {
    initialResult = JSON.parse(stored);
  }
} catch (err) {
  localStorage.removeItem("analysisResult");
}

const useAnalysisStore = create((set) => ({
  loading: false,

  result: initialResult,

  error: null,

  preparationPlan: initialResult?.preparationPlan || null,

  resources: initialResult?.resources || null,

  technicalQuestions: initialResult?.technicalQuestions || null,

  behavioralQuestions: initialResult?.behavioralQuestions || null,

  startAnalysis: () =>
    set({
      loading: true,
      error: null,
    }),

  setResult: (data) => {
    if (data) {
      localStorage.setItem(
        "analysisResult",
        JSON.stringify(data)
      );
    } else {
      localStorage.removeItem("analysisResult");
    }

    set({
      result: data,
      loading: false,
      error: null,
      preparationPlan: data?.preparationPlan || null,
      resources: data?.resources || null,
      technicalQuestions: data?.technicalQuestions || null,
      behavioralQuestions: data?.behavioralQuestions || null,
    });
  },

  setPreparationPlan: (data) =>
    set((state) => {
      const updatedResult = state.result ? { ...state.result, preparationPlan: data } : null;
      if (updatedResult) {
        localStorage.setItem("analysisResult", JSON.stringify(updatedResult));
      }
      return {
        preparationPlan: data,
        result: updatedResult,
      };
    }),

  setResources: (data) =>
    set((state) => {
      const updatedResult = state.result ? { ...state.result, resources: data } : null;
      if (updatedResult) {
        localStorage.setItem("analysisResult", JSON.stringify(updatedResult));
      }
      return {
        resources: data,
        result: updatedResult,
      };
    }),

  setTechnicalQuestions: (data) =>
    set((state) => {
      const updatedResult = state.result ? { ...state.result, technicalQuestions: data } : null;
      if (updatedResult) {
        localStorage.setItem("analysisResult", JSON.stringify(updatedResult));
      }
      return {
        technicalQuestions: data,
        result: updatedResult,
      };
    }),

  setBehavioralQuestions: (data) =>
    set((state) => {
      const updatedResult = state.result ? { ...state.result, behavioralQuestions: data } : null;
      if (updatedResult) {
        localStorage.setItem("analysisResult", JSON.stringify(updatedResult));
      }
      return {
        behavioralQuestions: data,
        result: updatedResult,
      };
    }),

  setError: (err) =>
    set({
      error: err,
      loading: false,
    }),

  resetAnalysis: () => {
    localStorage.removeItem("analysisResult");

    set({
      loading: false,
      result: null,
      error: null,
      preparationPlan: null,
      resources: null,
      technicalQuestions: null,
      behavioralQuestions: null,
    });
  },
}));

export default useAnalysisStore;