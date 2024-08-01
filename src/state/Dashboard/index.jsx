import { createGlobalState } from "..";

export const useUserState = createGlobalState("user", {
	name: "Darius",
	isSignedIn: true,
});
