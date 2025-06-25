import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import {
	DateTime,
	EditDelete,
	Input,
	LinkWithCopy,
	StatusButton,
	Textarea,
} from '@/ui';

import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

export const Columns = ({
	isUpdate,
	setValue,
	BatchOrdersField = [],
	NewBatchOrdersField = [],
	handelDelete = () => {},
	register,
	errors,
	watch = () => {},
	status = '',
	is_new = false,
}) => {
	const haveAccess = useAccess('dyeing__zipper_batch_entry_update');

	const commonColumns = [
		{
			accessorKey: 'order_number',
			header: 'Order ID',
			width: 'w-36',
			enableSorting: true,
			cell: (info) => {
				const { order_number, order_type, bleaching } =
					info.row.original;
				const isBleached = bleaching === 'bleach';
				return (
					<div className='flex flex-col gap-1'>
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>

						<div className='grid grid-cols-2 gap-1'>
							<span>Type:</span>
							<span>{order_type}</span>
							<span>Bleach:</span>
							<StatusButton
								value={isBleached}
								className='h-4 min-h-4 pl-1 pr-1 text-xs'
							/>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'item_description',
			header: 'Item Description',
			enableColumnFilter: true,
			width: 'w-36',
			enableSorting: true,
		},
		// {
		// 	accessorKey: 'order_type',
		// 	header: 'Type',
		// 	enableColumnFilter: true,
		// 	enableSorting: true,
		// },
		{
			accessorKey: 'style',
			header: 'Style',
			width: 'w-36',
			enableColumnFilter: true,
			enableSorting: true,
		},
		// {
		// 	accessorKey: 'bleaching',
		// 	header: 'Bleach',
		// 	enableColumnFilter: false,
		// 	enableSorting: true,
		// },
		{
			accessorKey: 'color',
			header: 'Color',
			width: 'w-36',
			enableColumnFilter: true,
			enableSorting: true,
		},
		{
			accessorKey: 'color_ref',
			header: 'Color Ref',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'recipe_name',
			header: 'Recipe',
			enableColumnFilter: true,
			enableSorting: true,
			width: 'w-44',
			cell: (info) => {
				const {
					recipe_name,
					approved,
					approved_date,
					is_pps_req,
					is_pps_req_date,
				} = info.row.original;
				return (
					<div className='flex flex-col gap-1'>
						<span>{recipe_name}</span>
						<div className='grid grid-cols-3 gap-1'>
							Bulk:
							<StatusButton
								value={approved}
								className='h-4 min-h-4 pl-1 pr-1 text-xs'
							/>
							<DateTime date={approved_date} isTime={false} />
							PP:
							<StatusButton
								value={is_pps_req}
								className='h-4 min-h-4 pl-1 pr-1 text-xs'
							/>
							<DateTime date={is_pps_req_date} isTime={false} />
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'size',
			header: 'Size',
			enableColumnFilter: false,
			enableSorting: true,
		},
		{
			accessorKey: 'unit',
			header: 'Unit',
			enableColumnFilter: false,
			enableSorting: true,
		},
		{
			accessorFn: (row) => {
				if (row.unit === 'Meter') return '-';
				return row.order_quantity;
			},
			id: 'order_quantity',
			header: 'Order QTY',
			enableColumnFilter: false,
			enableSorting: true,
			width: 'w-20',
		},
		{
			accessorFn: (row) => getRequiredTapeKg({ row, type: 'raw' }),
			id: 'tape_req_kg',
			header: (
				<>
					Tape Req <br />
					(Kg)
				</>
			),
			enableColumnFilter: false,
			enableSorting: true,
			cell: (info) => info.getValue().toFixed(3),
		},
	];

	const defaultColumns = useMemo(
		() => [
			...commonColumns,
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
							<input
								type='button'
								className='btn btn-primary btn-xs'
								disabled={isUpdate}
								value={'Copy'}
								onClick={() =>
									setValue(
										`dyeing_batch_entry[${idx}].quantity`,
										info.getValue(),
										{
											shouldDirty: true,
										}
									)
								}
							/>

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
						errors?.dyeing_batch_entry?.[idx]?.quantity;
					return (
						<Input
							key={idx}
							label={`dyeing_batch_entry[${idx}].quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'cal_tape_req_kg',
				header: (
					<>
						Cal Tape <br />
						(Kg)
					</>
				),
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => {
					const { index } = row;
					const quantity = parseFloat(
						watch(`dyeing_batch_entry[${index}].quantity`) || 0
					);
					return getRequiredTapeKg({
						row: row.original,
						type: 'raw',
						input_quantity: quantity,
					}).toFixed(3);
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
						key={info.row.index}
						label={`dyeing_batch_entry[${info.row.index}].remarks`}
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
		[BatchOrdersField, watch, register, errors]
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
		[...(is_new ? [NewBatchOrdersField] : [BatchOrdersField]), errors]
	);

	return columns;
};
