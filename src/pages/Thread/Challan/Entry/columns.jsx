import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import { EditDelete, Input, Textarea } from '@/ui';

export default function columns({
	setValue,
	BatchEntryField,
	NewBatchEntryField,
	register,
	errors,
	handelDelete = () => {},
	is_new = false,
}) {
	const haveAccess = useAccess('thread__challan_update');

	const setAllQty = () => {
		if (is_new) {
			NewBatchEntryField.map((item, idx) => {
				setValue(
					`new_batch_entry[${idx}].quantity`,
					item.balance_quantity
				);
			});
		} else {
			BatchEntryField.map((item, idx) => {
				setValue(`batch_entry[${idx}].quantity`, item.balance_quantity);
			});
		}
	};

	const default_columns = [
		{
			accessorKey: 'order_number',
			header: 'O/N',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'count',
			header: 'Count',
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
			accessorKey: 'length',
			header: 'Length(mtr)',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'order_quantity',
			header: 'Order QTY',
			enableColumnFilter: true,
			enableSorting: true,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'warehouse',
			header: 'Warehouse',
			enableColumnFilter: true,
			enableSorting: true,
			cell: (info) => info.getValue(),
		},
	];

	const current_columns = [
		{
			accessorKey: 'balance_quantity',
			width: 'w-36',
			header: (
				<div className='flex flex-col'>
					Balance QTY
					<label
						className='btn btn-primary btn-xs'
						onClick={() => setAllQty()}
					>
						Copy All
					</label>
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
			header: 'Quantity(cone)',
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
			accessorKey: 'short_quantity',
			header: 'Short QTY',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicerror = errors?.batch_entry?.[idx]?.short_quantity;
				return (
					<Input
						label={`batch_entry[${info.row.index}].short_quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicerror}
						{...{ register, errors }}
					/>
				);
			},
		},
		{
			accessorKey: 'reject_quantity',
			header: 'Reject QTY',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicerror =
					errors?.batch_entry?.[idx]?.reject_quantity;
				return (
					<Input
						label={`batch_entry[${info.row.index}].reject_quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicerror}
						{...{ register, errors }}
					/>
				);
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
			hidden: !haveAccess.includes('delete'),
			width: 'w-24',
			cell: (info) => (
				<EditDelete
					idx={info.row.original}
					handelDelete={handelDelete}
					showDelete={haveAccess.includes('delete')}
					showUpdate={false}
				/>
			),
		},
	];

	const new_columns = [
		{
			accessorKey: 'balance_quantity',
			width: 'w-36',
			header: (
				<div className='flex flex-col'>
					Balance QTY
					<label
						className='btn btn-primary btn-xs'
						onClick={() => setAllQty()}
					>
						Copy All
					</label>
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
			header: 'Quantity(cone)',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicerror = errors?.new_batch_entry?.[idx]?.quantity;
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
			accessorKey: 'short_quantity',
			header: 'Short QTY',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicerror =
					errors?.new_batch_entry?.[idx]?.short_quantity;
				return (
					<Input
						label={`new_batch_entry[${info.row.index}].short_quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicerror}
						{...{ register, errors }}
					/>
				);
			},
		},
		{
			accessorKey: 'reject_quantity',
			header: 'Reject QTY',
			enableColumnFilter: false,
			enableSorting: false,
			cell: (info) => {
				const idx = info.row.index;
				const dynamicerror =
					errors?.new_batch_entry?.[idx]?.reject_quantity;
				return (
					<Input
						label={`new_batch_entry[${info.row.index}].reject_quantity`}
						is_title_needed='false'
						height='h-8'
						dynamicerror={dynamicerror}
						{...{ register, errors }}
					/>
				);
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
	];

	const columns = useMemo(
		() => [...default_columns, ...(is_new ? new_columns : current_columns)],
		[...(is_new ? [NewBatchEntryField] : [BatchEntryField]), errors]
	);

	return columns;
}
