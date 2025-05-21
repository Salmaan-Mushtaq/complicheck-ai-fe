import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/users")({
	component: UserList,
});
export default function UserList() {
	return <div>user-list</div>;
}
