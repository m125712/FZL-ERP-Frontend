import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import { EditDelete, Input, Textarea } from '@/ui';

export const Columns = ({
	isUpdate,
	setValue,
	OrderDetailsField = [],
	NewBatchOrdersField = [],
	handelDelete = () => {},
	register,
	errors,
	watch = () => {},
	status = '',
	is_new = false,
	isZipper,
}) => {
	const haveAccess = useAccess('delivery__quantity_return');

	const zipperColumns = [
		{
			accessorKey: 'item_description',
			header: 'Item Description',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'size',
			header: 'Size',
			enableColumnFilter: true,
			enableSorting: true,
		},
	];

	const threadColumns = [
		{
			accessorKey: 'count_length_name',
			header: 'Count Length',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'length',
			header: 'Length',
			enableColumnFilter: true,
			enableSorting: true,
		},
	];

	const commonColumns = [
		...(isZipper ? zipperColumns : threadColumns),
		{
			accessorKey: 'style',
			header: 'Style',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'color',
			header: 'Color',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'color_ref',
			header: 'Color Ref',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: true,
			enableSorting: true,
		},
	];

	const defaultColumns = useMemo(
		() => [
			...commonColumns,

			{
				accessorKey: 'fresh_quantity',
				header: 'Fresh QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.order_details?.[idx]?.fresh_quantity;
					return (
						<Input
							key={idx}
							label={`order_details[${idx}].fresh_quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'repair_quantity',
				header: 'Repair QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.order_details?.[idx]?.repair_quantity;
					return (
						<Input
							key={idx}
							label={`order_details[${idx}].repair_quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
		],
		[OrderDetailsField, watch, register, errors]
	);

	const newColumns = useMemo(
		() => [
			...commonColumns,
			{
				accessorKey: 'balance_quantity',
				header: (
					<div className='flex flex-col'>
						Balanced Batch
						{/* <label
							className='btn btn-primary btn-xs'
							onClick={() => setAllQty()}>
							Copy All
						</label> */}
					</div>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					return (
						<div className='flex gap-4'>
							<label
								className='btn btn-primary btn-xs'
								onClick={() =>
									setValue(
										`new_dyeing_batch_entry[${idx}].quantity`,
										info.getValue(),
										{
											shouldDirty: true,
										}
									)
								}
							>
								Copy
							</label>
							{info.getValue()}
						</div>
					);
				},
			},

			{
				accessorKey: 'batch_qty',
				header: 'Batch QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.new_dyeing_batch_entry?.[idx]?.quantity;
					return (
						<Input
							label={`new_dyeing_batch_entry[${idx}].quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'top',
				header: 'Cal Tape (Kg)',
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => {
					const { top, bottom, raw_mtr_per_kg, size } = row.original;
					const idx = row.index;

					const total_size_in_mtr =
						((parseFloat(top) +
							parseFloat(bottom) +
							parseFloat(size)) *
							parseFloat(
								watch(
									`new_dyeing_batch_entry[${idx}].quantity`
								) || 0
							)) /
						100;

					return Number(
						total_size_in_mtr / parseFloat(raw_mtr_per_kg)
					).toFixed(3);
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-44',
				cell: (info) => (
					<Textarea
						label={`new_dyeing_batch_entry[${info.row.index}].remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[NewBatchOrdersField, register, errors, status]
	);

	const columns = useMemo(
		() => [...(is_new ? newColumns : defaultColumns)],
		[...(is_new ? [NewBatchOrdersField] : [OrderDetailsField]), errors]
	);

	return columns;
};
