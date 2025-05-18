import { StatusButton } from '@/ui';

const createColumn = (props) => ({
	...props,
});

const createStockProdColumn = ({ accessorKey, header }) =>
	createColumn({
		accessorKey,
		header,
		enableColumnFilter: false,
		cell: (info) => {
			// if (info.row.original[`item_name`].toLowerCase() === 'nylon')
			// 	return '-/-';
			const stock = Number(info.row.original[`${accessorKey}_stock`]);
			const prod = Number(info.row.original[`${accessorKey}_prod`]);
			return info.getValue() ? info.getValue() : `${stock} / ${prod}`;
		},
	});

const createStatusColumn = ({ accessorKey, header }) =>
	createColumn({
		accessorKey,
		header,
		enableColumnFilter: false,
		cell: (info) => {
			const { company_price, party_price, swatch_approval_date } =
				info.row.original;
			return (
				<div className='flex items-center justify-start gap-2'>
					<StatusButton
						size='btn-xs'
						value={
							Number(company_price) > 0 && Number(party_price) > 0
								? 1
								: 0
						}
						idx={info.row.index + 1}
						// showIdx={true}
					/>
					<StatusButton
						size='btn-xs'
						value={swatch_approval_date ? 1 : 0}
						idx={info.row.index + 1}
						// showIdx={true}
					/>
				</div>
			);
		},
	});

const getColumn = ({ show_price, is_sample }) => {
	// default columns
	const DefaultStartColumn = [
		createColumn({
			accessorKey: 'index',
			header: 'ID',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'item_description',
			header: 'Item Dec',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createStatusColumn({
			accessorKey: 'swatch_status',
			header: (
				<span>
					Status <br /> (Price/Swatch)
				</span>
			),
		}),
		createColumn({
			accessorKey: 'style',
			header: 'Style',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		}),

		createColumn({
			accessorKey: 'color',
			header: 'Color',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorFn: (row) => row?.bleaching === 'bleach',
			id: 'bleach',
			header: 'Bleach',
			enableColumnFilter: false,
			cell: (info) => (
				<StatusButton size='btn-xs' value={info.getValue()} />
			),
		}),
		createColumn({
			accessorKey: 'order_type',
			header: 'Type',
			enableColumnFilter: true,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorFn: (row) => {
				if (row.order_type === 'slider' || row.order_type === 'tape')
					return '---';
				return row.is_inch ? row.size : '---';
			},
			id: 'sizes_inch',
			header: `Size (Inch)`,
			enableColumnFilter: true,
		}),
		createColumn({
			accessorFn: (row) => {
				if (row.order_type === 'slider' || row.order_type === 'tape')
					return '---';
				return row.is_inch ? '---' : row.size;
			},
			id: 'sizes_cm',
			header: `Size (Cm)`,
			enableColumnFilter: true,
		}),
		createColumn({
			accessorFn: (row) => (row.order_type === 'tape' ? row.size : '---'),
			id: 'sizes_meter',
			header: `Size (MTR)`,
			enableColumnFilter: true,
		}),
		createColumn({
			accessorKey: 'finishing_balance',
			header: (
				<div>
					Finishing <br /> Balance
				</div>
			),
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),

		createColumn({
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'total_pi_quantity',
			header: 'PI',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'total_reject_quantity',
			header: 'Reject',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'total_short_quantity',
			header: 'Short',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),

		...(!is_sample
			? [
					createColumn({
						accessorKey: 'dying_and_iron_prod',
						header: (
							<>
								Tape <br />
								Production
							</>
						),
						enableColumnFilter: false,
						cell: (info) => info.getValue(),
					}),
					createStockProdColumn({
						accessorKey: 'teeth_molding',
						header: (
							<>
								Teeth <br />
								Molding
							</>
						),
					}),
					createStockProdColumn({
						accessorKey: 'teeth_coloring',
						header: (
							<>
								Teeth <br />
								Coloring
							</>
						),
					}),
				]
			: []),

		// createTapRequiredColumn({ measurement }),
	];
	const DefaultEndColumn = [
		...(!is_sample
			? [
					createColumn({
						accessorKey: 'coloring_prod',
						header: 'Slider',
						enableColumnFilter: false,
						cell: (info) => info.getValue(),
					}),
					createStockProdColumn({
						accessorKey: 'finishing',
						header: 'Finishing',
					}),
				]
			: []),

		createColumn({
			accessorKey: 'total_warehouse_quantity',
			header: 'Warehouse',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'total_delivery_quantity',
			header: 'Delivered',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'company_price',
			header: (
				<>
					Price (USD) <br />
					(Company/Party)
				</>
			),
			enableColumnFilter: false,
			hidden: !show_price,
			cell: (info) =>
				Number(info.getValue()) +
				' / ' +
				Number(info.row.original.party_price),
		}),
	];

	return [...DefaultStartColumn, ...DefaultEndColumn];
};

export default getColumn;
