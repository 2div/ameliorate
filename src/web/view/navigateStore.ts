import { temporal } from "zundo";
import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { Format, InfoCategory } from "../../common/infoCategory";
import { infoNodeTypes, nodeTypes } from "../../common/node";
import { emitter } from "../common/event";
import { useGraphPart } from "../topic/store/graphPartHooks";
import { getDefaultNode } from "../topic/store/nodeGetters";
import { DiagramFilter, StandardFilter, StandardFilterWithFallbacks } from "./utils/diagramFilter";
import { GeneralFilter } from "./utils/generalFilter";
import { TableFilter } from "./utils/tableFilter";

export type View = "topicDiagram" | "researchDiagram" | "criteriaTable" | "claimTree";

interface NavigateStoreState {
  selectedGraphPartId: string | null;
  format: Format;

  // info category state is flattened (rather than `[category]: state`) for ease of modifying
  categoriesToShow: InfoCategory[];
  structureFilter: StandardFilter;
  researchFilter: StandardFilter;
  justificationFilter: StandardFilter;

  tableFilter: TableFilter;
  generalFilter: GeneralFilter;
}

const initialState: NavigateStoreState = {
  selectedGraphPartId: null,
  format: "diagram",

  categoriesToShow: ["structure"],
  structureFilter: { type: "none" },
  researchFilter: { type: "none" },
  justificationFilter: { type: "none" },

  tableFilter: {
    solutions: [],
    criteria: [],
  },
  generalFilter: {
    nodeTypes: [...nodeTypes], // spread because this value is otherwise readonly
    showOnlyScored: false,
    scoredComparer: "≥",
    scoreToCompare: "5",
    showSecondaryResearch: false,
    showSecondaryStructure: true,
  },
};

const useNavigateStore = createWithEqualityFn<NavigateStoreState>()(
  temporal(devtools(() => initialState)),

  // Using `createWithEqualityFn` so that we can do a diff in hooks that return new arrays/objects
  // so that we can avoid extra renders
  // e.g. when we return URLSearchParams
  Object.is
);

// temporal store is a vanilla store, we need to wrap it to use it as a hook and be able to react to changes
const useTemporalStore = () => useStore(useNavigateStore.temporal);

// hooks
export const useSelectedGraphPart = () => {
  const selectedGraphPartId = useNavigateStore((state) => state.selectedGraphPartId);

  return useGraphPart(selectedGraphPartId);
};

export const useIsGraphPartSelected = (graphPartId: string) => {
  return useNavigateStore((state) => {
    if (!state.selectedGraphPartId) return false;
    return state.selectedGraphPartId === graphPartId;
  });
};

export const useIsAnyGraphPartSelected = (graphPartIds: string[]) => {
  return useNavigateStore((state) => {
    if (!state.selectedGraphPartId) return false;
    return graphPartIds.includes(state.selectedGraphPartId);
  });
};

export const useFormat = () => {
  return useNavigateStore((state) => state.format);
};

const useCategoriesToShow = () => {
  return useNavigateStore((state) => state.categoriesToShow, shallow);
};

const useStandardFilter = (category: InfoCategory) => {
  return useNavigateStore((state) => state[`${category}Filter`], shallow);
};

export const useDiagramFilter = (): DiagramFilter => {
  const categoriesToShow = useCategoriesToShow();
  const structureFilter = useStandardFilter("structure");
  const researchFilter = useStandardFilter("research");
  const justificationFilter = useStandardFilter("justification");

  return {
    structure: { show: categoriesToShow.includes("structure"), ...structureFilter },
    research: { show: categoriesToShow.includes("research"), ...researchFilter },
    justification: { show: categoriesToShow.includes("justification"), ...justificationFilter },
  };
};

export const useTableFilter = (): TableFilter => {
  return useNavigateStore(
    (state) => state.tableFilter,
    (before, after) => JSON.stringify(before) === JSON.stringify(after)
  );
};

export const useGeneralFilter = () => {
  return useNavigateStore((state) => state.generalFilter);
};

export const usePrimaryNodeTypes = () => {
  return useNavigateStore((state) => {
    return state.categoriesToShow.flatMap((category) => infoNodeTypes[category]);
  });
};

export const useCanGoBackForward = () => {
  const temporalStore = useTemporalStore();

  const canGoBack = temporalStore.pastStates.length > 0;
  const canGoForward = temporalStore.futureStates.length > 0;
  return [canGoBack, canGoForward];
};

// actions
export const setSelected = (graphPartId: string | null) => {
  useNavigateStore.setState({ selectedGraphPartId: graphPartId }, false, "setSelected");
};

export const setFormat = (format: Format) => {
  useNavigateStore.setState({ format }, false, "setFormat");
};

export const setShowInformation = (category: InfoCategory, show: boolean) => {
  const oldCategoriesToShow = useNavigateStore.getState().categoriesToShow;

  const newCategoriesToShow =
    show && !oldCategoriesToShow.includes(category)
      ? [...oldCategoriesToShow, category]
      : !show && oldCategoriesToShow.includes(category)
      ? oldCategoriesToShow.filter((c) => c !== category)
      : null;

  if (newCategoriesToShow) {
    useNavigateStore.setState(
      { categoriesToShow: newCategoriesToShow },
      false,
      "setShowInformation"
    );
    emitter.emit("changedDiagramFilter");
  }
};

export const setStandardFilter = (category: InfoCategory, filter: StandardFilter) => {
  const newFilter =
    category === "structure"
      ? { structureFilter: filter }
      : category === "research"
      ? { researchFilter: filter }
      : { justificationFilter: filter };

  useNavigateStore.setState(newFilter, false, "setStandardFilter");

  emitter.emit("changedDiagramFilter");
};

export const setTableFilter = (tableFilter: TableFilter) => {
  useNavigateStore.setState({ tableFilter }, false, "setTableFilter");
};

export const setGeneralFilter = (generalFilter: GeneralFilter) => {
  useNavigateStore.setState({ generalFilter }, false, "setGeneralFilter");
  emitter.emit("changedDiagramFilter");
};

export const viewCriteriaTable = (problemNodeId: string) => {
  useNavigateStore.setState(
    {
      format: "table",
      tableFilter: {
        centralProblemId: problemNodeId,
        solutions: [],
        criteria: [],
      },
    },
    false,
    "viewCriteriaTable"
  );
};

export const viewJustification = (arguedDiagramPartId: string) => {
  useNavigateStore.setState(
    {
      format: "diagram",
      categoriesToShow: ["justification"],
      justificationFilter: { type: "rootClaim", centralRootClaimId: arguedDiagramPartId },
    },
    false,
    "viewJustification"
  );
};

export const goBack = () => {
  useNavigateStore.temporal.getState().undo();
};

export const goForward = () => {
  useNavigateStore.temporal.getState().redo();
};

export const resetNavigation = () => {
  useNavigateStore.setState(initialState, true, "resetNavigation");
  useNavigateStore.temporal.getState().clear();
};

// helpers
export const getStandardFilterWithFallbacks = (
  category: InfoCategory
): StandardFilterWithFallbacks => {
  const standardFilter =
    category === "structure"
      ? useNavigateStore.getState().structureFilter
      : category === "research"
      ? useNavigateStore.getState().researchFilter
      : useNavigateStore.getState().justificationFilter;

  const centralProblemId = getDefaultNode("problem")?.id;
  const centralSolutionId = getDefaultNode("solution")?.id;
  const centralQuestionId = getDefaultNode("question")?.id;
  const centralSourceId = getDefaultNode("source")?.id;
  const centralRootClaimId = getDefaultNode("rootClaim")?.id;

  const standardFilterDefaults: StandardFilterWithFallbacks = {
    type: "none",
    centralProblemId,
    problemDetails: ["causes", "effects", "subproblems", "criteria", "solutions"],
    centralSolutionId,
    solutionDetail: "all",
    solutions: [],
    criteria: [],
    centralQuestionId,
    centralSourceId,
    centralRootClaimId,
  };

  // override any defaults using the stored filter
  return { ...standardFilterDefaults, ...standardFilter };
};

export const getTableFilterWithFallbacks = (): TableFilter => {
  const tableFilter = useNavigateStore.getState().tableFilter;

  const centralProblemId = getDefaultNode("problem")?.id;

  const tableFilterDefaults = {
    centralProblemId,
    solutions: [],
    criteria: [],
  };

  return { ...tableFilterDefaults, ...tableFilter };
};
