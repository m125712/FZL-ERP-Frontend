import ReactTableWithTitle from '@/components/Table/ReactTableWithTitle';
import { DateTime, LinkWithCopy } from '@/ui';
import { useMemo } from 'react';

export default function Index({ recipe }) {
	// console.log(recipe);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'recipe_name',
				header: 'Recipe Name',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={recipe_uuid}
							uri='/lab-dip/recipe/details'
						/>
					);
				},
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[recipe]
	);

	return (
		<ReactTableWithTitle title='Details' data={recipe} columns={columns} />
	);
}
