// columns.jsx
import { format } from 'date-fns';

import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	DateTime,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';

// Main table columns configuration
export const createColumns = ({
	data,
	recipe,
	handleSwatchStatus,
	haveAccess,
	handleSwatchApprovalDate,
	user,
}) => [
	{
		accessorKey: 'order_number',
		header: 'O/N',
		cell: (info) => {
			const { order_number } = info.row.original;
			return (
				<LinkWithCopy
					title={info.getValue()}
					id={order_number}
					uri='/order/details'
				/>
			);
		},
	},
	{
		accessorKey: 'item_description',
		header: 'Item Description',
		width: 'w-32',
		cell: (info) => {
			const { order_description_uuid, order_number } = info.row.original;
			return (
				<LinkWithCopy
					title={info.getValue()}
					id={order_description_uuid}
					uri={`/order/details/${order_number}`}
				/>
			);
		},
	},
	{
		accessorKey: 'style',
		header: 'Style',
		width: 'w-40',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'color',
		header: 'Color',
		width: 'w-40',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'color_ref',
		header: 'Color Ref',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'bleaching',
		header: 'Bleach',
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorFn: (row) => (row.is_batch_created ? 'Yes' : 'No'),
		id: 'is_dyeing_batch_entry',
		header: (
			<>
				Batch <br />
				Created
			</>
		),
		enableColumnFilter: false,
		cell: (info) => (
			<StatusButton
				className={'btn-xs'}
				value={info.row.original.is_batch_created}
			/>
		),
	},
	{
		accessorKey: 'receive_by_factory_time',
		header: (
			<>
				Factory <br />
				Received
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<DateTime date={info.row.original.receive_by_factory_time} />
		),
	},
	{
		accessorFn: (row) => (row?.swatch_approval_received ? 'Yes' : 'No'),
		id: 'swatch_approval_received',
		header: (
			<>
				Swatch <br />
				Rcv.
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<div className='flex flex-col'>
				<SwitchToggle
					disabled={!haveAccess.includes('click_swatch_status')}
					onChange={() => {
						handleSwatchApprovalDate(info.row.index);
					}}
					checked={
						info.row.original.swatch_approval_received === true
					}
				/>
				<span>
					{info.row.original.swatch_approval_received_by_name}
				</span>
			</div>
		),
	},
	{
		accessorFn: (row) => {
			if (row?.swatch_approval_received_date === null) return null;
			return format(row?.swatch_approval_received_date, 'dd/MM/yyyy');
		},
		id: 'swatch_approval_received_date',
		header: (
			<>
				Swatch App <br />
				Rcv Date
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<DateTime date={info.row.original.swatch_approval_received_date} />
		),
	},
	{
		accessorKey: 'recipe_name',
		header: 'Recipe',
		enableColumnFilter: false,
		hidden: !haveAccess.includes('update'),
		width: 'min-w-52',
		cell: (info) => {
			const { recipe_uuid, order_info_uuid, bleaching } =
				info.row.original;

			const swatchAccess = haveAccess.includes('click_swatch_status');
			const swatchAccessOverride = haveAccess.includes(
				'click_swatch_status_override'
			);

			let isDisabled = true;
			if (swatchAccessOverride) isDisabled = false;
			if (recipe_uuid === null && swatchAccess) isDisabled = false;

			return (
				<ReactSelect
					key={recipe_uuid}
					placeholder='Select order info uuid'
					options={recipe?.filter(
						(recipeItem) =>
							(recipeItem.bleaching === bleaching &&
								recipeItem.order_info_uuid ===
									order_info_uuid) ||
							recipeItem.value === null
					)}
					value={recipe?.find((item) => item.value == recipe_uuid)}
					onChange={(e) => handleSwatchStatus(e, info.row.index)}
					isDisabled={isDisabled}
					menuPortalTarget={document.body}
				/>
			);
		},
	},
	{
		accessorFn: (row) => {
			if (row.max === null) return null;
			return format(row.max, 'dd/MM/yyyy');
		},
		id: 'max',
		header: (
			<>
				Setup <br />
				Date
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => <DateTime date={info.row.original.max} />,
	},
	{
		accessorKey: 'color_ref_entry_date',
		header: (
			<>
				Color Ref <br /> Entry
			</>
		),
		filterFn: 'isWithinRange',
		enableColumnFilter: false,
		width: 'w-24',
		cell: (info) => <DateTime date={info.getValue()} />,
	},
	{
		accessorKey: 'color_ref_update_date',
		header: (
			<>
				Color Ref <br /> Update
			</>
		),
		filterFn: 'isWithinRange',
		enableColumnFilter: false,
		width: 'w-24',
		cell: (info) => <DateTime date={info.getValue()} />,
	},
];

// Log table columns configuration
export const createColumnsLog = ({
	data,
	recipe,
	handleSwatchStatusLog,
	haveAccess,
	handleSwatchApprovalDateLog,
	user,
}) => [
	{
		accessorKey: 'order_number',
		header: 'O/N',
		cell: (info) => {
			const { order_number } = info.row.original;
			return (
				<LinkWithCopy
					title={info.getValue()}
					id={order_number}
					uri='/order/details'
				/>
			);
		},
	},
	{
		accessorKey: 'item_description',
		header: 'Item Description',
		width: 'w-32',
		cell: (info) => {
			const { order_description_uuid, order_number } = info.row.original;
			return (
				<LinkWithCopy
					title={info.getValue()}
					id={order_description_uuid}
					uri={`/order/details/${order_number}`}
				/>
			);
		},
	},
	{
		accessorKey: 'style',
		header: 'Style',
		width: 'w-40',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'color',
		header: 'Color',
		width: 'w-40',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'color_ref',
		header: 'Color Ref',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'size',
		header: 'Size',
		width: 'w-24',
		cell: (info) => info.getValue(),
	},
	{
		accessorFn: (row) => {
			if (row.order_type === 'tape') return 'MTR';
			return row.is_inch === 1 ? 'INCH' : 'CM';
		},
		id: 'unit',
		header: 'Unit',
		enableColumnFilter: false,
	},
	{
		accessorKey: 'quantity',
		header: (
			<>
				QTY <br />
				(PCS)
			</>
		),
		enableColumnFilter: false,
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'bleaching',
		header: 'Bleach',
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorFn: (row) => (row.is_batch_created ? 'Yes' : 'No'),
		id: 'is_dyeing_batch_entry',
		header: (
			<>
				Batch <br />
				Created
			</>
		),
		enableColumnFilter: false,
		cell: (info) => (
			<StatusButton
				className={'btn-xs'}
				value={info.row.original.is_batch_created}
			/>
		),
	},
	{
		accessorKey: 'receive_by_factory_time',
		header: (
			<>
				Factory <br />
				Received
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<DateTime date={info.row.original.receive_by_factory_time} />
		),
	},
	{
		accessorFn: (row) => (row.swatch_approval_received ? 'Yes' : 'No'),
		id: 'swatch_approval_received',
		header: (
			<>
				Swatch <br />
				Rcv.
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<div className='flex flex-col'>
				<SwitchToggle
					disabled={!haveAccess.includes('click_swatch_status')}
					onChange={() => {
						handleSwatchApprovalDateLog(info.row.index);
					}}
					checked={
						info.row.original.swatch_approval_received === true
					}
				/>
				<span>
					{info.row.original.swatch_approval_received_by_name}
				</span>
			</div>
		),
	},
	{
		accessorFn: (row) => {
			if (row.swatch_approval_received_date === null) return null;
			return format(row.swatch_approval_received_date, 'dd/MM/yyyy');
		},
		id: 'swatch_approval_received_date',
		header: (
			<>
				Swatch App <br />
				Rcv Date
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<DateTime date={info.row.original.swatch_approval_received_date} />
		),
	},
	{
		accessorKey: 'recipe_name',
		header: 'Recipe',
		enableColumnFilter: false,
		hidden: !haveAccess.includes('update'),
		width: 'min-w-52',
		cell: (info) => {
			const { recipe_uuid, order_info_uuid, bleaching } =
				info.row.original;

			const swatchAccess = haveAccess.includes('click_swatch_status');
			const swatchAccessOverride = haveAccess.includes(
				'click_swatch_status_override'
			);

			let isDisabled = true;
			if (swatchAccessOverride) isDisabled = false;
			if (recipe_uuid === null && swatchAccess) isDisabled = false;

			return (
				<ReactSelect
					key={recipe_uuid}
					placeholder='Select order info uuid'
					options={recipe?.filter(
						(recipeItem) =>
							(recipeItem.bleaching === bleaching &&
								recipeItem.order_info_uuid ===
									order_info_uuid) ||
							recipeItem.value === null
					)}
					value={recipe?.find((item) => item.value == recipe_uuid)}
					onChange={(e) => handleSwatchStatusLog(e, info.row.index)}
					isDisabled={isDisabled}
					menuPortalTarget={document.body}
				/>
			);
		},
	},
	{
		accessorFn: (row) => {
			if (row.swatch_approval_date === null) return null;
			return format(row.swatch_approval_date, 'dd/MM/yyyy');
		},
		id: 'swatch_approval_date',
		header: (
			<>
				Setup <br />
				Date
			</>
		),
		width: 'w-24',
		enableColumnFilter: false,
		cell: (info) => (
			<DateTime date={info.row.original.swatch_approval_date} />
		),
	},
	{
		accessorKey: 'color_ref_entry_date',
		header: (
			<>
				Color Ref <br /> Entry
			</>
		),
		filterFn: 'isWithinRange',
		enableColumnFilter: false,
		width: 'w-24',
		cell: (info) => <DateTime date={info.getValue()} />,
	},
	{
		accessorKey: 'color_ref_update_date',
		header: (
			<>
				Color Ref <br /> Update
			</>
		),
		filterFn: 'isWithinRange',
		enableColumnFilter: false,
		width: 'w-24',
		cell: (info) => <DateTime date={info.getValue()} />,
	},
];
