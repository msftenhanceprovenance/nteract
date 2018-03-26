// @flow

import type { ContentRef, KernelRef } from "../state/refs";
import type { ContentRecord, ContentModel } from "../state/entities/contents";

import type {
  AppRecord,
  HostRecord,
  JupyterHostRecord,
  CoreRecord
} from "../state";

// FIXME FIXME FIXME SUPER WRONG FIXME FIXME FIXME
type AppState = {
  // The new way
  core: CoreRecord,
  // The old way
  app: AppRecord,
  comms: *,
  config: Object
};

import { makeEmptyModel } from "../state/entities/contents";

import { toJS, stringifyNotebook } from "@nteract/commutable";
import * as Immutable from "immutable";
import { createSelector } from "reselect";

function identity<T>(thing: T): T {
  return thing;
}

export const serverConfig = (host: JupyterHostRecord) => {
  return {
    endpoint: host.origin + host.basePath,
    crossDomain: host.crossDomain,
    token: host.token
  };
};

export const userPreferences = createSelector(
  (state: AppState) => state.config,
  config => config.toJS()
);

export const appVersion = createSelector(
  (state: AppState) => state.app.version,
  identity
);

// Quick memoized host and kernel selection.
//
// Intended to be useful for a core app and be future proof for when we have
// both refs and selected/current hosts and kernels
export const currentHost = createSelector(
  (state: AppState) => state.app.host,
  identity
);

export const contentByRef = (state: AppState) =>
  state.core.entities.contents.byRef;

export const content = (
  state: AppState,
  { contentRef }: { contentRef: ContentRef }
) => contentByRef(state).get(contentRef);

export const currentContentRef = (state: AppState) =>
  state.core.currentContentRef;

export const currentContent: (
  state: AppState
) => ?ContentRecord = createSelector(
  currentContentRef,
  contentByRef,
  (contentRef, byRef) => (contentRef ? byRef.get(contentRef) : null)
);

export const kernelsByRef = (state: AppState) =>
  state.core.entities.kernels.byRef;

export const kernel = (
  state: AppState,
  { kernelRef }: { kernelRef: KernelRef }
) => kernelsByRef(state).get(kernelRef);

export const currentKernelRef = (state: AppState) => state.core.kernelRef;

export const currentKernel = createSelector(
  currentKernelRef,
  kernelsByRef,
  (kernelRef, byRef) => (kernelRef ? byRef.get(kernelRef) : null)
);

export const currentKernelType = createSelector([currentKernel], kernel => {
  if (kernel && kernel.type) {
    return kernel.type;
  }
  return null;
});

export const currentKernelStatus = createSelector([currentKernel], kernel => {
  if (kernel && kernel.status) {
    return kernel.status;
  }
  return "not connected";
});

export const currentHostType = createSelector([currentHost], host => {
  if (host && host.type) {
    return host.type;
  }
  return null;
});

export const isCurrentKernelZeroMQ = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "local" && kernelType === "zeromq";
  }
);

export const isCurrentHostJupyter = createSelector(
  [currentHostType],
  hostType => hostType === "jupyter"
);

export const isCurrentKernelJupyterWebsocket = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "jupyter" && kernelType === "websocket";
  }
);

export const comms = createSelector((state: AppState) => state.comms, identity);

// NOTE: These are comm models, not contents models
export const models = createSelector([comms], comms => comms.get("models"));

export const currentModel: (state: AppState) => ContentModel = createSelector(
  (state: AppState) => currentContent(state),
  currentContent => {
    return currentContent ? currentContent.model : makeEmptyModel();
  }
);

export const currentContentType: (
  state: AppState
) => "notebook" | "dummy" | "directory" | "file" | null = createSelector(
  (state: AppState) => currentContent(state),
  content => (content ? content.type : null)
);

// TODO: if we're not looking at a notebook in the UI, there may not _be_ a
// notebook object to get. Do we return null? Throw an error?
export const currentNotebook: (
  state: AppState
) => ?Immutable.Map<string, any> = createSelector(
  currentModel,
  model => (model.type === "notebook" ? model.notebook : null)
);

export const currentSavedNotebook = createSelector(
  currentModel,
  model => (model.type === "notebook" ? model.savedNotebook : null)
);

export const hasBeenSaved = createSelector(
  currentNotebook,
  currentSavedNotebook,
  (original, disk) => Immutable.is(original, disk)
);

export const currentLastSaved = createSelector(
  (state: AppState) => currentContent(state),
  currentContent => (currentContent ? currentContent.lastSaved : null)
);

export const currentNotebookMetadata = createSelector(
  currentModel,
  model =>
    model.type === "notebook"
      ? model.notebook.get("metadata", Immutable.Map())
      : Immutable.Map()
);

const CODE_MIRROR_MODE_DEFAULT = "text";
export const codeMirrorMode = createSelector(
  [currentNotebookMetadata],
  metadata =>
    metadata.getIn(["language_info", "codemirror_mode"]) ||
    metadata.getIn(["kernel_info", "language"]) ||
    metadata.getIn(["kernelspec", "language"]) ||
    CODE_MIRROR_MODE_DEFAULT
);

export const currentDisplayName = createSelector(
  [currentNotebookMetadata],
  metadata => metadata.getIn(["kernelspec", "display_name"], "")
);

export const currentNotebookGithubUsername = createSelector(
  [currentNotebookMetadata],
  metadata => metadata.get("github_username", null)
);

export const currentNotebookGistId = createSelector(
  [currentNotebookMetadata],
  metadata => metadata.get("gist_id", null)
);

export const currentNotebookJS = createSelector([currentNotebook], notebook => {
  if (notebook) {
    return toJS(notebook);
  }
  return null;
});

export const currentNotebookString = createSelector(
  [currentNotebookJS],
  notebookJS => {
    if (notebookJS) {
      return stringifyNotebook(notebookJS);
    }
    return "";
  }
);

export const currentFocusedCellId = createSelector(
  currentModel,
  model => (model.type === "notebook" ? model.cellFocused : null)
);

export const currentFocusedEditorId = createSelector(
  currentModel,
  model => (model.type === "notebook" ? model.editorFocused : null)
);

export const transientCellMap = createSelector(
  currentModel,
  model =>
    model.type === "notebook"
      ? model.transient.get("cellMap", Immutable.Map())
      : Immutable.Map()
);

export const currentCellMap = createSelector([currentNotebook], notebook => {
  if (notebook) {
    return notebook.get("cellMap", Immutable.Map());
  }
  return null;
});

export const currentCellOrder = createSelector([currentNotebook], notebook => {
  if (notebook) {
    return notebook.get("cellOrder");
  }
  return null;
});

export const currentCodeCellIds = createSelector(
  [currentCellMap, currentCellOrder],
  (cellMap, cellOrder) => {
    if (cellMap && cellOrder) {
      return cellOrder.filter(
        id => cellMap.getIn([id, "cell_type"]) === "code"
      );
    }
    return Immutable.List();
  }
);

export const currentCodeCellIdsBelow = createSelector(
  [currentFocusedCellId, currentCellMap, currentCellOrder],
  (focusedCellId, cellMap, cellOrder) => {
    if (cellMap && cellOrder) {
      const index = cellOrder.indexOf(focusedCellId);
      return cellOrder
        .skip(index)
        .filter(id => cellMap.getIn([id, "cell_type"]) === "code");
    }
    return Immutable.List();
  }
);

export const currentHiddenCellIds = createSelector(
  [currentCellMap, currentCellOrder],
  (cellMap, cellOrder) => {
    if (cellMap && cellOrder) {
      return cellOrder.filter(id =>
        cellMap.getIn([id, "metadata", "inputHidden"])
      );
    }
    return null;
  }
);

export const currentIdsOfHiddenOutputs = createSelector(
  [currentCellMap, currentCellOrder],
  (cellMap, cellOrder): Immutable.List<any> => {
    if (!cellOrder || !cellMap) {
      return Immutable.List();
    }

    return cellOrder.filter(cellId =>
      cellMap.getIn([cellId, "metadata", "outputHidden"])
    );
  }
);

export const currentFilepath: (state: *) => string = createSelector(
  (state: AppState) => currentContent(state),
  currentContent => {
    return currentContent ? currentContent.filepath : "";
  }
);

export const modalType = createSelector(
  (state: AppState) => state.core.entities.modals.modalType,
  identity
);

export const currentTheme: (state: *) => string = createSelector(
  (state: AppState) => state.config.get("theme", "light"),
  identity
);

export const notificationSystem = createSelector(
  (state: AppState) => state.app.get("notificationSystem"),
  identity
);
