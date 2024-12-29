import { useMemo } from 'react';
import { useLabDipRecipeDetailsByUUID } from '@/state/LabDip';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';

export default function Index({
	batch_entry,
	water_capacity,
	total_yarn_quantity,
}) {
	const shade_recipe_uuids = batch_entry.map((entry) => entry.recipe_uuid);

	let shade_recipes_entries = shade_recipe_uuids.map((uuid) => {
		const { data: shade_recipe } = useLabDipRecipeDetailsByUUID(uuid);
		return shade_recipe?.recipe_entry.concat(shade_recipe?.programs);
	});

	shade_recipes_entries = shade_recipes_entries.reduce(
		(acc, curr) => acc.concat(curr),
		[]
	);
	const volume = parseFloat(total_yarn_quantity) * parseFloat(water_capacity);

	shade_recipes_entries = shade_recipes_entries.map((item) => ({
		...item,
		bulk: Number(volume * item?.quantity).toFixed(3),
	}));

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Dyes Name',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'Lab',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'bulk',
				header: 'Bulk',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[shade_recipes_entries, batch_entry]
	);

	return (
		<ReactTableTitleOnly
			title={`Yarn Weight:${Number(total_yarn_quantity).toFixed(3)},
					 Water Capacity: ${Number(water_capacity).toFixed(2)}, 
					 Volume: ${Number(volume).toFixed(3)}`}
			data={shade_recipes_entries}
			columns={columns}
		/>
	);
}
