export const load = async () => {
	const tasks = Array.from({ length: 50000 }, (_, i) => ({
		id: crypto.randomUUID(),
		title: `Task ${i}`,
		completed: Math.random() > 0.5
	}));

	return { tasks };
};
