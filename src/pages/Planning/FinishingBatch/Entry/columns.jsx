import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import { CustomLink, EditDelete, Input, Textarea } from '@/ui';

export const Columns = ({
	setValue,
	BatchOrdersField = [],
	NewBatchOrdersField = [],
	handelDelete = () => {},
	register,
	errors,
	watch = () => {},
	is_new = false,
	isUpdate = false,
}) => {
	const haveAccess = useAccess('planning__finishing_batch_entry_update');

	// * setting all quantity in finishing_batch_entry to the balance quantity
	const setAllQty = () => {
		if (is_new) {
			NewBatchOrdersField.map((item, idx) => {
				setValue(
					`new_finishing_batch_entry[${idx}].quantity`,
					item.balance_quantity
				);
			});
		} else {
			BatchOrdersField.map((item, idx) => {
				setValue(
					`finishing_batch_entry[${idx}].quantity`,
					item.balance_quantity
				);
			});
		}
	};

	const defaultColumns = [
		{
			accessorFn: (row) =>
				row.order_type == 'slider' ? '--' : row.recipe_id,
			id: 'recipe_id',
			header: 'Recipe',
			enableColumnFilter: true,
			width: 'w-24',
			cell: (info) => {
				info.getValue();

				if (info.row.original.order_type == 'slider') return '--';
				return (
					<CustomLink
						label={info.getValue()}
						url={`/lab-dip/recipe/details/${info.row.original.recipe_uuid}`}
					/>
				);
			},
		},
		// {
		// 	accessorKey: 'order_type',
		// 	header: 'Type',
		// 	enableColumnFilter: true,
		// 	cell: (info) => info.getValue(),
		// },
		{
			accessorKey: 'style',
			header: 'Style',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'color',
			header: 'Color',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'size',
			header: 'Size',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'unit',
			header: 'Unit',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'order_quantity',
			header: 'Order QTY',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		},
	];

	const finishingBatchColumns = [
		{
			accessorKey: 'balance_quantity',
			header: (
				<div className='flex flex-col'>
					Balance QTY
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
				const { index } = info.row;
				return (
					<div className='flex gap-4'>
						{!isUpdate && (
							<label
								className='btn btn-primary btn-xs'
								onClick={() =>
									setValue(
										`finishing_batch_entry[${index}].quantity`,
										info.getValue(),
										{
											shouldDirty: true,
										}
									)
								}
							>
								Copy
							</label>
						)}
						{info.getValue()}
					</div>
				);
			},
		},
		{
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicError =
					errors?.finishing_batch_entry?.[idx]?.quantity;

				return (
					<Input
						label={`finishing_batch_entry[${info.row.index}].quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicError}
						{...{ register, errors }}
					/>
				);
			},
		},
		{
			accessorKey: 'remarks',
			header: 'Remarks',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicError =
					errors?.finishing_batch_entry?.[idx]?.remarks;

				return (
					<Textarea
						label={`finishing_batch_entry[${info.row.index}].remarks`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicError}
						{...{ register, errors }}
					/>
				);
			},
		},
		{
			accessorKey: 'actions',
			header: 'Actions',
			enableColumnFilter: false,
			enableSorting: false,
			hidden: !isUpdate,
			width: 'w-24',
			cell: (info) => (
				<EditDelete
					idx={info.row.index}
					handelDelete={handelDelete}
					showDelete={haveAccess.includes('delete')}
					showUpdate={false}
				/>
			),
		},
	];

	const newFinishingBatchColumns = [
		{
			accessorKey: 'balance_quantity',
			header: (
				<div className='flex flex-col'>
					Balance QTY
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
									`new_finishing_batch_entry[${idx}].quantity`,
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
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicError =
					errors?.new_finishing_batch_entry?.[idx]?.quantity;

				return (
					<Input
						label={`new_finishing_batch_entry[${info.row.index}].quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicError}
						{...{ register, errors }}
					/>
				);
			},
		},
		{
			accessorKey: 'remarks',
			header: 'Remarks',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicError =
					errors?.new_finishing_batch_entry?.[idx]?.remarks;

				return (
					<Textarea
						label={`new_finishing_batch_entry[${info.row.index}].remarks`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicError}
						{...{ register, errors }}
					/>
				);
			},
		},
	];

	const columns = useMemo(
		() => [
			...defaultColumns,
			...(is_new ? newFinishingBatchColumns : finishingBatchColumns),
		],
		[
			...(is_new ? [NewBatchOrdersField] : [BatchOrdersField]),
			watch('order_description_uuid'),
			errors,
		]
	);

	return columns;
};
