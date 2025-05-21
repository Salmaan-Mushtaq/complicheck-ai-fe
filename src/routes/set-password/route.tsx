import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/set-password")({
	component: SetPassword,
});
export default function SetPassword() {
	return <div>route</div>;
}
