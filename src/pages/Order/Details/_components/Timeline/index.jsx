import clsx from 'clsx';

import { capitalize } from '@/ui/Core/utils';

import { getMeasurement } from '@/util/Need';

import { getPercent, getTotals } from './utils';

const timelines = {
	vislon: ['dying_and_iron', 'teeth_molding', 'finishing', 'coloring'],
	metal: [
		'dying_and_iron',
		'teeth_molding',
		'teeth_coloring',
		'finishing',
		'coloring',
	],
	nylon: ['dying_and_iron', 'finishing', 'coloring'],
};

const getActualValue = (props, item) => {
	const values = getPercent(
		props[`total_${item}`],
		props[`req_${item}`]?.toFixed(3) || props?.total_quantity
	);
	return isNaN(values) ? '0%' : values + '%';
};

const Timeline = ({ type, props }) => {
	const timelineItems = timelines[type];

	return (
		<ul className='sb-green timeline flex justify-start overflow-x-auto text-xs md:justify-center'>
			{timelineItems.map((item, idx) => (
				<li key={item}>
					{idx !== 0 && <hr />}
					<div
						className={clsx(
							'btn btn-circle btn-primary timeline-middle',
							item === 'finishing' && 'bg-success'
						)}
					>
						{getActualValue(props, item)}
					</div>
					<div className='badge timeline-end badge-primary badge-outline select-none border shadow-md transition-colors duration-300 hover:bg-secondary/50'>
						{capitalize(item)}
					</div>
					{idx !== timelineItems.length - 1 && <hr />}
				</li>
			))}
		</ul>
	);
};

export default function Index(props) {
	const measurement = getMeasurement({
		item: props.item_name,
		stopper_type: props.stopper_type_name,
		zipper_number: props.zipper_number_name,
		end_type: props.end_type_name,
	});

	if (props?.item_name === 'vislon') {
		return (
			<Timeline
				type='vislon'
				props={getTotals(props.order_entry, measurement)}
			/>
		);
	}
	if (props?.item_name === 'metal') {
		return (
			<Timeline
				type='metal'
				props={getTotals(props.order_entry, measurement)}
			/>
		);
	}
	if (props?.item_name === 'nylon') {
		return (
			<Timeline
				type='nylon'
				props={getTotals(props.order_entry, measurement)}
			/>
		);
	}
}
