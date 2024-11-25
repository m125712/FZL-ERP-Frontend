import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import { EditDelete, Input, Textarea } from '@/ui';

export const Columns = ({
	isUpdate,
	setValue,
	BatchOrdersField = [],
	NewBatchOrdersField = [],
	handelDelete = () => {},
	register,
	errors,
	watch = () => {},
	is_new = false,
}) => {
	const haveAccess = useAccess('dyeing__thread_batch_entry_update');

	// * setting all quantity in finishing_batch_entry to the balance quantity
	const setAllQty = () => {
		if (is_new) {
			NewBatchOrdersField.map((item, idx) => {
				setValue(
					`new_batch_entry[${idx}].quantity`,
					item.balance_quantity
				);
			});
		} else {
			BatchOrdersField.map((item, idx) => {
				setValue(`batch_entry[${idx}].quantity`, item.balance_quantity);
			});
		}
	};
	const commonColumns = [
		{
			accessorKey: 'order_number',
			header: 'O/N',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'recipe_name',
			header: 'Shade Recipe',
			enableColumnFilter: true,
			enableSorting: true,
		},
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
			accessorKey: 'count_length',
			header: 'Count Length',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'bleaching',
			header: 'Bleaching',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'po',
			header: 'PO',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'order_quantity',
			header: 'Order QTY',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => info.getValue(),
		},
	];
	const defaultColumns = useMemo(
		() => [
			...commonColumns,
			{
				accessorKey: 'balance_quantity',
				header: (
					<div className='flex flex-col'>
						Balance
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
										`batch_entry[${idx}].quantity`,
										info.getValue()
									)
								}>
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
					const dynamicerror = errors?.batch_entry?.[idx]?.quantity;
					return (
						<Input
							label={`batch_entry[${info.row.index}].quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'expected_weight',
				header: (
					<div>
						Expected <br /> Weight
					</div>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const { max_weight } = info.row.original;
					const expected_weight =
						parseFloat(
							watch(`batch_entry[${info.row.index}].quantity`) ||
								0
						) * parseFloat(max_weight);

					return Number(expected_weight).toFixed(3);
				},
			},
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-44',
				cell: (info) => (
					<Textarea
						label={`batch_entry[${info.row.index}].batch_remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},

			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('delete') || !isUpdate,
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete') && isUpdate}
						showUpdate={false}
					/>
				),
			},
		],
		[BatchOrdersField, register, errors]
	);
	const newColumns = useMemo(
		() => [
			...commonColumns,
			{
				accessorKey: 'balance_quantity',
				header: (
					<div className='flex flex-col'>
						Balance
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
										`new_batch_entry[${idx}].quantity`,
										info.getValue()
									)
								}>
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
					const dynamicerror =
						errors?.new_batch_entry?.[idx]?.quantity;
					return (
						<Input
							label={`new_batch_entry[${info.row.index}].quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'expected_weight',
				header: (
					<div>
						Expected <br /> Weight
					</div>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const { max_weight } = info.row.original;
					const expected_weight =
						parseFloat(
							watch(
								`new_batch_entry[${info.row.index}].quantity`
							) || 0
						) * parseFloat(max_weight);

					return Number(expected_weight).toFixed(3);
				},
			},
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-44',
				cell: (info) => (
					<Textarea
						label={`new_batch_entry[${info.row.index}].batch_remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[NewBatchOrdersField, register, errors]
	);

	const columns = useMemo(
		() => [...(is_new ? newColumns : defaultColumns)],
		[...(is_new ? [NewBatchOrdersField] : [BatchOrdersField]), errors]
	);

	return columns;
};
