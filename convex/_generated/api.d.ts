/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_mutations_createRecording from "../functions/mutations/createRecording.js";
import type * as functions_mutations_updateRecordingName from "../functions/mutations/updateRecordingName.js";
import type * as functions_queries_getRecordingById from "../functions/queries/getRecordingById.js";
import type * as functions_queries_listRecordings from "../functions/queries/listRecordings.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/mutations/createRecording": typeof functions_mutations_createRecording;
  "functions/mutations/updateRecordingName": typeof functions_mutations_updateRecordingName;
  "functions/queries/getRecordingById": typeof functions_queries_getRecordingById;
  "functions/queries/listRecordings": typeof functions_queries_listRecordings;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
