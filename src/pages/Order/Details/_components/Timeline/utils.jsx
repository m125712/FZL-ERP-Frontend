import { capitalize } from '@/ui/Core/utils';

import { getTapeRequired } from '@/util/Need';

const getPercent = (total, req) => ((total / req) * 100).toFixed(0);

const getTotals = (order_entry, measurement) => {
	return order_entry?.reduce(
		(acc, item) => {
			acc.total_dying_and_iron += item.total_dying_and_iron;
			acc.total_teeth_molding += item.total_teeth_molding;
			acc.total_teeth_coloring += item.total_teeth_coloring;
			acc.total_finishing += item.total_finishing;
			acc.total_coloring += item.total_coloring;
			acc.total_quantity += item.quantity;
			acc.req_dying_and_iron += Number(
				getTapeRequired({
					top: measurement?.top,
					bottom: measurement?.bottom || 0,
					mtr: measurement?.mtr,
					size: item.size,
					pcs: item.quantity,
				})
			);
			return acc;
		},
		{
			total_dying_and_iron: 0,
			total_teeth_molding: 0,
			total_teeth_coloring: 0,
			total_finishing: 0,
			total_coloring: 0,
			total_quantity: 0,
			req_dying_and_iron: 0,
		}
	);
};

export { getPercent, getTotals };

// if (props.item_name === "vislon") {
// 	return <VislonTimeline {...all_total} />;
// }
// if (props.item_name === "metal") {
// 	return <MetalTimeline {...all_total} />;
// }
// if (props.item_name === "nylon") {
// 	return <NylonTimeline {...all_total} />;
// }

const VislonTimeline = (props) => {
	return (
		<ul className='timeline flex justify-start overflow-x-auto text-xs md:justify-center'>
			<li>
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_dying_and_iron,
						props.req_dying_and_iron
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('dying_and_iron')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_teeth_molding,
						props.total_quantity
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('teeth_molding')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-success timeline-middle bg-success'>
					{getPercent(props.total_finishing, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-success badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('finishing')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(props.total_coloring, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('coloring')}
				</div>
			</li>
		</ul>
	);
};

const MetalTimeline = (props) => {
	return (
		<ul className='timeline flex justify-start overflow-x-auto text-xs md:justify-center'>
			<li>
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_dying_and_iron,
						props.req_dying_and_iron
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('dying_and_iron')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_teeth_molding,
						props.total_quantity
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('teeth_molding')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_teeth_coloring,
						props.total_quantity
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('teeth_coloring')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-success timeline-middle bg-success'>
					{getPercent(props.total_finishing, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-success badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('finishing')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(props.total_coloring, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('coloring')}
				</div>
			</li>
		</ul>
	);
};

const NylonTimeline = (props) => {
	return (
		<ul className='timeline flex justify-start overflow-x-auto text-xs md:justify-center'>
			<li>
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(
						props.total_dying_and_iron,
						props.req_dying_and_iron
					)}
					%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('dying_and_iron')}
				</div>
				<hr />
			</li>

			<li>
				<hr />
				<div className='btn btn-circle btn-success timeline-middle bg-success'>
					{getPercent(props.total_finishing, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-success badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('finishing')}
				</div>
				<hr />
			</li>
			<li>
				<hr />
				<div className='btn btn-circle btn-primary timeline-middle'>
					{getPercent(props.total_coloring, props.total_quantity)}%
				</div>
				<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
					{capitalize('coloring')}
				</div>
			</li>
		</ul>
	);
};
