// @flow
import * as actionTypes from "./actionTypes";

import type { Notebook } from "@nteract/commutable";

import type { HostRef, KernelspecsRef } from "./state/refs";
import type { KernelspecProps } from "./state/entities/kernelspecs";

import type {
  LanguageInfoMetadata,
  LocalKernelProps,
  RemoteKernelProps
} from "./state";

import type {
  CellID,
  CellType,
  MimeBundle
} from "@nteract/commutable/src/types";

import type { Output } from "@nteract/commutable/src/v4";

import type {
  UnhideAll,
  RestartKernel,
  RestartKernelFailed,
  RestartKernelSuccessful,
  ShutdownReplyTimedOut,
  ShutdownReplySucceeded,
  DeleteConnectionFileFailedAction,
  DeleteConnectionFileSuccessfulAction,
  ExecuteCellAction,
  ExecuteFocusedCellAction,
  FetchKernelspecs,
  FetchKernelspecsFulfilled,
  FetchKernelspecsFailed,
  PasteCellAction,
  ChangeFilenameAction,
  ToggleCellExpansionAction,
  ChangeCellTypeAction,
  CutCellAction,
  CopyCellAction,
  DeleteMetadataFieldAction,
  OverwriteMetadataFieldAction,
  AcceptPayloadMessageAction,
  SetNotebookAction,
  NewCellAfterAction,
  NewCellBeforeAction,
  ClearAllOutputs,
  ClearOutputsAction,
  AppendOutputAction,
  UpdateDisplayAction,
  FocusNextCellAction,
  FocusCellEditorAction,
  FocusNextCellEditorAction,
  FocusPreviousCellEditorAction,
  RemoveCellAction,
  FocusCellAction,
  NewCellAppendAction,
  MergeCellAfterAction,
  MoveCellAction,
  ToggleStickyCellAction,
  FocusPreviousCellAction,
  SetKernelInfoAction,
  SetLanguageInfoAction,
  UpdateCellStatusAction,
  ToggleCellInputVisibilityAction,
  ToggleCellOutputVisibilityAction,
  SetInCellAction,
  SendExecuteMessageAction,
  NewKernelAction,
  SetGithubTokenAction,
  SetNotificationSystemAction,
  SetExecutionStateAction,
  SetConfigAction,
  LaunchKernelAction,
  LaunchKernelByNameAction,
  InterruptKernel,
  InterruptKernelSuccessful,
  InterruptKernelFailed,
  KillKernelAction,
  KillKernelFailed,
  KillKernelSuccessful,
  OpenModal,
  CloseModal,
  AddHost,
  FetchContent,
  FetchContentFulfilled,
  FetchContentFailed
} from "./actionTypes";

import { createExecuteRequest } from "@nteract/messaging";
import type { HostRecordProps } from "./state/entities/hosts";

export const openModal = (payload: { modalType: string }) => ({
  type: actionTypes.OPEN_MODAL,
  payload
});

export const closeModal = () => ({
  type: actionTypes.CLOSE_MODAL
});

export const addHost = (payload: {
  hostRef: HostRef,
  host: {
    id: ?string,
    type: "jupyter" | "local",
    defaultKernelName: string,
    kernelIds: ?Array<string>,
    token?: string,
    serverUrl?: string,
    crossDomain?: boolean
  }
}) => ({
  type: actionTypes.ADD_HOST,
  payload
});

export const fetchContent = (
  payload: { path: string, params: Object } = { path: "/", params: {} }
): FetchContent => ({
  type: actionTypes.FETCH_CONTENT,
  payload
});

export const fetchContentFulfilled = (payload: {
  path: string,
  model: any
}): FetchContentFulfilled => ({
  type: actionTypes.FETCH_CONTENT_FULFILLED,
  payload
});

export const fetchContentFailed = (payload: {
  path: string,
  error: Error
}): FetchContentFailed => ({
  type: actionTypes.FETCH_CONTENT_FAILED,
  payload
});

export const fetchKernelspecs = (payload: {
  kernelspecsRef: KernelspecsRef,
  hostRef: HostRef
}): FetchKernelspecs => ({
  type: actionTypes.FETCH_KERNELSPECS,
  payload
});

export const fetchKernelspecsFulfilled = (payload: {
  kernelspecsRef: KernelspecsRef,
  hostRef: HostRef,
  defaultKernelName: string,
  kernelspecs: { [string]: KernelspecProps }
}): FetchKernelspecsFulfilled => ({
  type: actionTypes.FETCH_KERNELSPECS_FULFILLED,
  payload
});

export const fetchKernelspecsFailed = (payload: {
  kernelspecsRef: KernelspecsRef,
  error: Object
}): FetchKernelspecsFailed => ({
  type: actionTypes.FETCH_KERNELSPECS_FAILED,
  payload
});

export function launchKernelFailed(error: Error) {
  return {
    type: actionTypes.LAUNCH_KERNEL_FAILED,
    payload: error,
    error: true
  };
}

export function launchKernelSuccessful(
  kernel: LocalKernelProps | RemoteKernelProps
): NewKernelAction {
  return {
    type: actionTypes.LAUNCH_KERNEL_SUCCESSFUL,
    kernel
  };
}

export function launchKernel(kernelSpec: any, cwd: string): LaunchKernelAction {
  return {
    type: actionTypes.LAUNCH_KERNEL,
    kernelSpec,
    cwd
  };
}

export function launchKernelByName(
  kernelSpecName: any,
  cwd: string
): LaunchKernelByNameAction {
  return {
    type: actionTypes.LAUNCH_KERNEL_BY_NAME,
    kernelSpecName,
    cwd
  };
}

export function setNotebookKernelInfo(kernelInfo: any): SetKernelInfoAction {
  return {
    type: actionTypes.SET_KERNEL_INFO,
    kernelInfo
  };
}

export function setExecutionState(
  kernelStatus: string
): SetExecutionStateAction {
  return {
    type: actionTypes.SET_EXECUTION_STATE,
    kernelStatus
  };
}

export function clearOutputs(id: string): ClearOutputsAction {
  return {
    type: actionTypes.CLEAR_OUTPUTS,
    id
  };
}

export function clearAllOutputs(): ClearAllOutputs {
  return {
    type: actionTypes.CLEAR_ALL_OUTPUTS
  };
}

export function moveCell(
  id: string,
  destinationId: string,
  above: boolean
): MoveCellAction {
  return {
    type: actionTypes.MOVE_CELL,
    id,
    destinationId,
    above
  };
}

export function removeCell(id: string): RemoveCellAction {
  return {
    type: actionTypes.REMOVE_CELL,
    id
  };
}

export function createCellAfter(
  cellType: CellType,
  id: string,
  source: string = ""
): NewCellAfterAction {
  return {
    type: actionTypes.NEW_CELL_AFTER,
    source,
    cellType,
    id
  };
}

export function createCellBefore(
  cellType: CellType,
  id: string
): NewCellBeforeAction {
  return {
    type: actionTypes.NEW_CELL_BEFORE,
    cellType,
    id
  };
}

export function createCellAppend(cellType: CellType): NewCellAppendAction {
  return {
    type: actionTypes.NEW_CELL_APPEND,
    cellType
  };
}

export function mergeCellAfter(id: string): MergeCellAfterAction {
  return {
    type: actionTypes.MERGE_CELL_AFTER,
    id
  };
}

/**
 * setInCell can generically be used to set any attribute on a cell, including
 * and especially for changing metadata per cell.
 * @param {CellID} id    cell ID
 * @param {Array<string>} path  path within a cell to set
 * @param {any} value what to set it to
 *
 * Example:
 *
 * > action = setInCell('123', ['metadata', 'cool'], true)
 * > documentReducer(state, action)
 * {
 *   ...
 *   '123': {
 *     'metadata': {
 *       'cool': true
 *     }
 *   }
 * }
 *
 */
export function setInCell<T>(
  id: CellID,
  path: Array<string>,
  value: T
): SetInCellAction<T> {
  return {
    type: actionTypes.SET_IN_CELL,
    id,
    path,
    value
  };
}

export function updateCellSource(
  id: string,
  source: string
): SetInCellAction<string> {
  return setInCell(id, ["source"], source);
}

export function updateCellExecutionCount(
  id: string,
  count: number
): SetInCellAction<number> {
  return setInCell(id, ["execution_count"], count);
}

export function unhideAll(
  payload?: { outputHidden: boolean, inputHidden: boolean } = {
    outputHidden: false,
    inputHidden: false
  }
): UnhideAll {
  return {
    type: "UNHIDE_ALL",
    payload: { outputHidden: false, inputHidden: false, ...payload }
  };
}

export function toggleCellOutputVisibility(
  id: string
): ToggleCellOutputVisibilityAction {
  return {
    type: actionTypes.TOGGLE_CELL_OUTPUT_VISIBILITY,
    id
  };
}

export function toggleCellInputVisibility(
  id: string
): ToggleCellInputVisibilityAction {
  return {
    type: actionTypes.TOGGLE_CELL_INPUT_VISIBILITY,
    id
  };
}

export function updateCellStatus(
  id: string,
  status: string
): UpdateCellStatusAction {
  return {
    type: actionTypes.UPDATE_CELL_STATUS,
    id,
    status
  };
}

/* Unlike focus next & previous, to set focus, we require an ID,
   because the others are based on there already being a focused cell */
export function focusCell(id: string): FocusCellAction {
  return {
    type: actionTypes.FOCUS_CELL,
    id
  };
}

export function focusNextCell(
  id: ?string,
  createCellIfUndefined: boolean = true
): FocusNextCellAction {
  return {
    type: actionTypes.FOCUS_NEXT_CELL,
    id,
    createCellIfUndefined
  };
}

export function focusNextCellEditor(id: ?string): FocusNextCellEditorAction {
  return {
    type: actionTypes.FOCUS_NEXT_CELL_EDITOR,
    id
  };
}

export function focusPreviousCell(id: ?string): FocusPreviousCellAction {
  return {
    type: actionTypes.FOCUS_PREVIOUS_CELL,
    id
  };
}

export function focusCellEditor(id: ?string): FocusCellEditorAction {
  return {
    type: actionTypes.FOCUS_CELL_EDITOR,
    id
  };
}

export function focusPreviousCellEditor(
  id: ?string
): FocusPreviousCellEditorAction {
  return {
    type: actionTypes.FOCUS_PREVIOUS_CELL_EDITOR,
    id
  };
}

export function toggleStickyCell(id: string): ToggleStickyCellAction {
  return {
    type: actionTypes.TOGGLE_STICKY_CELL,
    id
  };
}

export function overwriteMetadata(
  field: string,
  value: any
): OverwriteMetadataFieldAction {
  return {
    type: actionTypes.OVERWRITE_METADATA_FIELD,
    field,
    value
  };
}

export function deleteMetadata(field: string): DeleteMetadataFieldAction {
  return {
    type: actionTypes.DELETE_METADATA_FIELD,
    field
  };
}

export function killKernel(
  payload: { restarting: boolean } = { restarting: false }
): KillKernelAction {
  return {
    type: actionTypes.KILL_KERNEL,
    payload
  };
}

export function killKernelFailed(payload: Error): KillKernelFailed {
  return {
    type: actionTypes.KILL_KERNEL_FAILED,
    payload,
    error: true
  };
}

export function killKernelSuccessful(): KillKernelSuccessful {
  return {
    type: actionTypes.KILL_KERNEL_SUCCESSFUL
  };
}

export function interruptKernel(): InterruptKernel {
  return {
    type: actionTypes.INTERRUPT_KERNEL
  };
}

export function interruptKernelSuccessful(): InterruptKernelSuccessful {
  return {
    type: actionTypes.INTERRUPT_KERNEL_SUCCESSFUL
  };
}

export function interruptKernelFailed(error: Error): interruptKernelFailed {
  return {
    type: actionTypes.INTERRUPT_KERNEL_FAILED,
    payload: error,
    error: true
  };
}

export function setNotificationSystem(
  notificationSystem: any
): SetNotificationSystemAction {
  return {
    type: actionTypes.SET_NOTIFICATION_SYSTEM,
    notificationSystem
  };
}

export function copyCell(id: CellID): CopyCellAction {
  return {
    type: actionTypes.COPY_CELL,
    id
  };
}

export function cutCell(id: CellID): CutCellAction {
  return {
    type: actionTypes.CUT_CELL,
    id
  };
}

export function pasteCell(): PasteCellAction {
  return {
    type: actionTypes.PASTE_CELL
  };
}

export function changeCellType(id: CellID, to: CellType): ChangeCellTypeAction {
  return {
    type: actionTypes.CHANGE_CELL_TYPE,
    id,
    to
  };
}

export function setGithubToken(githubToken: string): SetGithubTokenAction {
  return {
    type: actionTypes.SET_GITHUB_TOKEN,
    githubToken
  };
}

export function setConfigAtKey<T>(key: string, value: T): SetConfigAction<T> {
  return {
    type: actionTypes.SET_CONFIG_AT_KEY,
    key,
    value
  };
}

export function setTheme(theme: string): SetConfigAction<string> {
  return setConfigAtKey("theme", theme);
}

export function setCursorBlink(value: string): SetConfigAction<string> {
  return setConfigAtKey("cursorBlinkRate", value);
}

export function toggleOutputExpansion(id: string): ToggleCellExpansionAction {
  return {
    type: actionTypes.TOGGLE_OUTPUT_EXPANSION,
    id
  };
}

export function executeCell(id: string): ExecuteCellAction {
  return {
    type: actionTypes.EXECUTE_CELL,
    id
  };
}

export function executeAllCells() {
  return {
    type: actionTypes.EXECUTE_ALL_CELLS
  };
}

export function executeAllCellsBelow() {
  return {
    type: actionTypes.EXECUTE_ALL_CELLS_BELOW
  };
}

export function executeFocusedCell(): ExecuteFocusedCellAction {
  return {
    type: actionTypes.EXECUTE_FOCUSED_CELL
  };
}

export function sendExecuteMessage(
  id: string,
  message: *
): SendExecuteMessageAction {
  return {
    type: actionTypes.SEND_EXECUTE_REQUEST,
    id,
    message
  };
}

export function changeFilename(filename: string): ChangeFilenameAction {
  return {
    type: actionTypes.CHANGE_FILENAME,
    filename
  };
}

export function save() {
  return {
    type: actionTypes.SAVE
  };
}

export function saveFailed(error: Error) {
  return {
    type: actionTypes.SAVE_FAILED,
    payload: error,
    error: true
  };
}

export function saveAs(filename: string) {
  return {
    type: actionTypes.SAVE_AS,
    filename
  };
}

export function doneSaving() {
  return {
    type: actionTypes.DONE_SAVING
  };
}

// TODO: Use a kernel spec type
export function newNotebook(kernelSpec: Object, cwd: string) {
  return {
    type: actionTypes.NEW_NOTEBOOK,
    kernelSpec,
    cwd:
      cwd ||
      // TODO: Does it matter that this is our fallback when targeting the web app
      process.cwd()
  };
}

// Expects notebook to be JS Object or Immutable.js
export const setNotebook = (
  filename: ?string,
  notebook: Notebook
): SetNotebookAction => ({
  type: actionTypes.SET_NOTEBOOK,
  filename,
  notebook
});

export const loadConfig = () => ({ type: actionTypes.LOAD_CONFIG });
export const saveConfig = () => ({ type: actionTypes.SAVE_CONFIG });
export const doneSavingConfig = () => ({
  type: actionTypes.DONE_SAVING_CONFIG
});

export const configLoaded = (config: any) => ({
  type: actionTypes.MERGE_CONFIG,
  config
});

/**
 * Action creator for comm_open messages
 * @param  {jmp.Message} a comm_open message
 * @return {Object}      COMM_OPEN action
 */
export function commOpenAction(message: any) {
  // invariant: expects a comm_open message
  return {
    type: actionTypes.COMM_OPEN,
    data: message.content.data,
    metadata: message.content.metadata,
    comm_id: message.content.comm_id,
    target_name: message.content.target_name,
    target_module: message.content.target_module,
    // Pass through the buffers
    buffers: message.blob || message.buffers
    // NOTE: Naming inconsistent between jupyter notebook and jmp
    //       see https://github.com/n-riesco/jmp/issues/14
    //       We just expect either one
  };
}

/**
 * Action creator for comm_msg messages
 * @param  {jmp.Message} a comm_msg
 * @return {Object}      COMM_MESSAGE action
 */
export function commMessageAction(message: any) {
  return {
    type: actionTypes.COMM_MESSAGE,
    comm_id: message.content.comm_id,
    data: message.content.data,
    // Pass through the buffers
    buffers: message.blob || message.buffers
    // NOTE: Naming inconsistent between jupyter notebook and jmp
    //       see https://github.com/n-riesco/jmp/issues/14
    //       We just expect either one
  };
}

export function appendOutput(id: CellID, output: Output): AppendOutputAction {
  return {
    type: actionTypes.APPEND_OUTPUT,
    id,
    output
  };
}

export function acceptPayloadMessage(
  id: CellID,
  payload: *
): AcceptPayloadMessageAction {
  return {
    type: actionTypes.ACCEPT_PAYLOAD_MESSAGE_ACTION,
    id,
    payload
  };
}

export function updateDisplay(content: {
  data: MimeBundle,
  metadata: JSONObject,
  transient: { display_id: string }
}): UpdateDisplayAction {
  return {
    type: actionTypes.UPDATE_DISPLAY,
    content
  };
}

export function setLanguageInfo(
  langInfo: LanguageInfoMetadata
): SetLanguageInfoAction {
  return {
    type: actionTypes.SET_LANGUAGE_INFO,
    langInfo
  };
}

export function deleteConnectionFileFailed(
  error: Error
): DeleteConnectionFileFailedAction {
  return {
    type: actionTypes.DELETE_CONNECTION_FILE_FAILED,
    payload: error,
    error: true
  };
}

export function deleteConnectionFileSuccessful(): DeleteConnectionFileSuccessfulAction {
  return {
    type: actionTypes.DELETE_CONNECTION_FILE_SUCCESSFUL
  };
}

export function shutdownReplySucceeded(
  payload: Object
): ShutdownReplySucceeded {
  return {
    type: actionTypes.SHUTDOWN_REPLY_SUCCEEDED,
    payload
  };
}

export function shutdownReplyTimedOut(error: Error): ShutdownReplyTimedOut {
  return {
    type: actionTypes.SHUTDOWN_REPLY_TIMED_OUT,
    payload: error,
    error: true
  };
}

export function restartKernel(
  payload: { clearOutputs: boolean } = { clearOutputs: false }
): RestartKernel {
  return {
    type: actionTypes.RESTART_KERNEL,
    payload
  };
}

export function restartKernelFailed(error: Error): RestartKernelFailed {
  return {
    type: actionTypes.RESTART_KERNEL_FAILED,
    payload: error,
    error: true
  };
}

export function restartKernelSuccessful(): RestartKernelSuccessful {
  return {
    type: actionTypes.RESTART_KERNEL_SUCCESSFUL
  };
}
