import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/projects")({
	component: ProjectList,
});
export default function ProjectList() {
	return <div>Project List</div>;
}
