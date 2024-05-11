<script lang="ts">
	import { createTable, Subscribe, Render } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';

	let { data } = $props();

	const tasks = writable(data.tasks);

	const table = createTable(tasks, {
		page: addPagination({ initialPageSize: 100 })
	});

	const columns = table.createColumns([
		table.column({
			header: 'ID',
			accessor: 'id'
		}),
		table.column({
			header: 'Title',
			accessor: 'title'
		}),
		table.column({
			header: 'Completed',
			accessor: 'completed',
			cell: ({ value }) => (value ? 'Yes' : 'No')
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex, pageCount } = pluginStates.page;

	$effect(() => {
		$tasks = data.tasks;
	});
</script>

<table {...$tableAttrs}>
	<thead>
		{#each $headerRows as headerRow}
			<Subscribe rowAttrs={headerRow.attrs()}>
				<tr>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
							<th {...attrs}>
								<Render of={cell.render()} />
							</th>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</thead>
	<tbody {...$tableBodyAttrs}>
		{#each $pageRows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<tr {...rowAttrs}>
					{#each row.cells as cell (cell.id)}
						<Subscribe props={cell.props()} attrs={cell.attrs()} let:attrs>
							<td {...attrs}>
								<Render of={cell.render()} />
							</td>
						</Subscribe>
						<Subscribe props={cell.props()} attrs={cell.attrs()} let:attrs>
							<td {...attrs}>
								<Render of={cell.render()} />
							</td>
						</Subscribe>
						<Subscribe props={cell.props()} attrs={cell.attrs()} let:attrs>
							<td {...attrs}>
								<Render of={cell.render()} />
							</td>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td>
				<button disabled={!$hasPreviousPage} onclick={() => ($pageIndex = $pageIndex - 1)}>
					Previous
				</button>
				<button
					disabled={!$hasNextPage}
					onclick={() => {
						$pageIndex = $pageIndex + 1;
					}}
				>
					Next
				</button>
				<span>
					Page <span>{$pageIndex + 1}</span> of
					<span>{$pageCount || 1}</span>
				</span>
			</td>
		</tr>
	</tfoot>
</table>
