import { StatusButton } from '@/ui';
import { getMeasurement, getTapeRequired } from '@/util/Need';

const createColumn = (props) => ({
	...props,
});

const createStockProdColumn = ({ accessorKey, header }) =>
	createColumn({
		accessorKey,
		header,
		enableColumnFilter: false,
		cell: (info) => {
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
			const { company_price, party_price } = info.row.original;
			return (
				<div className='flex items-center justify-start gap-2'>
					<StatusButton
						size='btn-xs'
						value={company_price > 0 && party_price > 0 ? 1 : 0}
						idx={info.row.index + 1}
						// showIdx={true}
					/>
					<StatusButton
						size='btn-xs'
						value={info.getValue() === 'approved' ? 1 : 0}
						idx={info.row.index + 1}
						// showIdx={true}
					/>
				</div>
			);
		},
	});

const createTapRequiredColumn = ({ measurement }) =>
	createColumn({
		accessorKey: 'tape_need',
		header: (
			<span>
				Tape Req (kg) <br /> [3% extra]
			</span>
		),
		enableColumnFilter: false,
		cell: (info) => {
			const { size, quantity } = info.row.original;
			return getTapeRequired({
				top: measurement?.top,
				bottom: measurement?.bottom || 0,
				mtr: measurement?.mtr,
				size: size,
				pcs: quantity,
			});
		},
	});

const getColumn = ({
	item_name,
	end_type_name,
	stopper_type_name,
	zipper_number_name,
	show_price,
}) => {
	const measurement = getMeasurement({
		item: item_name,
		stopper_type: stopper_type_name,
		zipper_number: zipper_number_name,
		end_type: end_type_name,
	});

	// default columns
	const DefaultStartColumn = [
		createColumn({
			accessorKey: 'id',
			header: 'ID',
			enableColumnFilter: false,
			cell: (info) => info.row.index + 1,
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
		createTapRequiredColumn({ measurement }),
	];
	const DefaultEndColumn = [
		createStockProdColumn({
			accessorKey: 'coloring',
			header: 'Coloring',
		}),
		createStockProdColumn({
			accessorKey: 'finishing',
			header: 'Finishing',
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

	// return columns based on item_name
	if (item_name === 'nylon') {
		return [...DefaultStartColumn, ...DefaultEndColumn];
	}
	if (item_name === 'vislon') {
		return [
			...DefaultStartColumn,
			createStockProdColumn({
				accessorKey: 'teeth_molding',
				header: (
					<span>
						Teeth <br /> Molding
					</span>
				),
			}),
			...DefaultEndColumn,
		];
	}
	if (item_name === 'metal') {
		return [
			...DefaultStartColumn,
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
			...DefaultEndColumn,
		];
	}
};

export default getColumn;
