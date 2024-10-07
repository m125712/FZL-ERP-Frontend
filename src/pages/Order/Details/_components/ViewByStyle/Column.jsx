import { useAccess } from '@/hooks';

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

const getColumn = ({ show_price }) => {
	// default columns
	const DefaultStartColumn = [
		createColumn({
			accessorKey: 'id',
			header: 'ID',
			enableColumnFilter: false,
			cell: (info) => info.row.index + 1,
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
			accessorKey: 'size',
			header: 'Size',
			enableColumnFilter: true,
			cell: (info) => Number(info.getValue()).toFixed(2),
		}),
		createColumn({
			accessorKey: 'quantity',
			header: 'Quantity',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createColumn({
			accessorKey: 'total_pi_quantity',
			header: 'Total PI QTY',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createColumn({
			accessorKey: 'total_reject_quantity',
			header: 'Total Reject QTY',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createColumn({
			accessorKey: 'total_short_quantity',
			header: 'Total Short QTY',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createColumn({
			accessorKey: 'bleaching',
			header: 'Bleaching',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		}),
		createColumn({
			accessorKey: 'dying_and_iron_prod',
			header: (
				<span>
					Tape <br /> Production
				</span>
			),
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(3),
		}),
		createStockProdColumn({
			accessorKey: 'teeth_molding',
			header: (
				<span>
					Teeth <br /> Molding
				</span>
			),
		}),
		createStockProdColumn({
			accessorKey: 'teeth_coloring',
			header: (
				<span>
					Teeth <br /> Coloring
				</span>
			),
		}),
		// createTapRequiredColumn({ measurement }),
	];
	const DefaultEndColumn = [
		createColumn({
			accessorKey: 'coloring_prod',
			header: 'Slider',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createStockProdColumn({
			accessorKey: 'finishing',
			header: 'Finishing',
		}),
		createColumn({
			accessorKey: 'total_delivery_quantity',
			header: 'Total Delivery QTY',
			enableColumnFilter: false,
			cell: (info) => Number(info.getValue()).toFixed(0),
		}),
		createColumn({
			accessorKey: 'company_price',
			header: (
				<span>
					Price (USD)
					<br />
					(Company/Party)
				</span>
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
