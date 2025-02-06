import { lazy, useMemo, useState } from 'react';
import { useOtherRM } from '@/state/Other';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { Transfer } from '@/ui';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index({ trxArea = [], info = {} }) {
	const { data, isLoading } = useOtherRM(
		'multi-field',
		`${trxArea?.map((item) => item.value).join(',')}`
	);

	const haveAccess = useAccess(info.getTab());

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: true,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorFn: (row) =>
					row.section
						.replace(/_|n_/g, ' ')
						.split(' ') // Split the string into words
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						) // Capitalize the first letter of each word
						.join(' '), // Join the words back into a single string,,,
				id: 'section',
				header: 'Section',
				width: 'w-24',
				enableColumnFilter: true,
			},
			{
				accessorKey: 'quantity',
				header: 'Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action',
				header: 'Used',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_used'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[data]
	);

	const [updateDyeingStock, setUpdateDyeingStock] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateDyeingStock((prev) => ({
			...prev,
			...data[idx],
			trxArea,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateDyeingStock,
						setUpdateDyeingStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
