import type { UserData } from "../../interfaces/User";
import { mapState } from "../store/mapState";

export function setUser(user: UserData) {
  mapState.update(state => ({
    ...state,
    user
  }))
}
