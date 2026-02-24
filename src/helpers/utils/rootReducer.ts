import {
  defaultLocalStorage,
  setLocalStorage,
} from "./helperFunctions";
import { initialFirstDealerOrder, EMPTY_ROUND } from "./constants";
import type { AppState, AppAction } from "../../types";

export const initialState = {
  currentRound: defaultLocalStorage("currentRound", EMPTY_ROUND),
  roundHistory: defaultLocalStorage("roundHistory", []),
  firstDealerOrder: defaultLocalStorage(
    "firstDealerOrder",
    initialFirstDealerOrder,
  ),
  isFirstGameAmongTeammates: defaultLocalStorage(
    "isFirstGameAmongTeammates",
    true,
  ),
};

const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_CURRENT_ROUND":
      try {
        const round = { ...action.payload.currentRound };
        setLocalStorage("currentRound", round);
        return {
          ...state,
          currentRound: round,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case "RESET_CURRENT_ROUND":
      try {
        setLocalStorage("currentRound", EMPTY_ROUND);
        return {
          ...state,
          currentRound: EMPTY_ROUND,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case "RESET_ROUND_HISTORY":
      return {
        ...state,
        roundHistory: [],
      };
    case "SET_ROUND_HISTORY":
      try {
        const history = [...action.payload.roundHistory];
        setLocalStorage("roundHistory", history);
        return {
          ...state,
          roundHistory: history,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case "SET_FIRST_DEALER_ORDER":
      try {
        const order = [...action.payload.firstDealerOrder];
        setLocalStorage("firstDealerOrder", order);
        return {
          ...state,
          firstDealerOrder: order,
        };
      } catch (err) {
        console.error(err);
        return state;
      }
    case "SET_DEALER_OVERRIDE":
      try {
        const updatedCurrentRound = {
          ...state.currentRound,
          dealerOverride: action.payload.dealerOverride,
        };

        setLocalStorage("currentRound", updatedCurrentRound);

        return {
          ...state,
          currentRound: updatedCurrentRound,
        };
      } catch (err) {
        console.error("Error in SET_DEALER_OVERRIDE:", err);
        return state;
      }
    default:
      // @ts-ignore
      if (import.meta.env.DEV) {
        console.log("default called");
      }
      return state;
  }
};

export default rootReducer;
