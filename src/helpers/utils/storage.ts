import { getLocalStorage } from "./helperFunctions";
import type { Names, NilSetting } from "../../types";

export function getNames(): Names | null {
  return getLocalStorage<Names>("names");
}

export function getNilSetting(): NilSetting | null {
  return getLocalStorage<NilSetting>("nilScoringRule");
}
