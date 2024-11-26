import React from 'react';

import { SectionEntryBody } from '@/ui';

import DivContent from './divContent';

export default function Content({ data }) {
	const header = [
		'Machine',
		'Slot 1',
		'Slot 2',
		'Slot 3',
		'Slot 4',
		'Slot 5',
		'Slot 6',
	];

	return (
		<div className='overflow-x-auto rounded-t-md border'>
			<span className='flex items-center gap-4 bg-primary px-4 py-3 text-lg font-semibold capitalize text-primary-content'>
				Machines
			</span>

			<table className='w-full overflow-x-auto text-sm text-gray-600'>
				<thead>
					{header?.map((item, index) => (
						<th
							key={index}
							className='w-32 bg-base-200 px-4 py-2 text-left text-sm font-semibold capitalize leading-tight text-primary'>
							{item}
						</th>
					))}
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr key={index} className='border'>
							<td className='border px-4 text-left text-xs font-medium'>
								{item.machine}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_1 ? (
									<DivContent data={item.slot_1} />
								) : null}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_2 ? (
									<DivContent data={item.slot_2} />
								) : null}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_3 ? (
									<DivContent data={item.slot_3} />
								) : null}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_4 ? (
									<DivContent data={item.slot_4} />
								) : null}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_5 ? (
									<DivContent data={item.slot_5} />
								) : null}
							</td>
							<td className='border text-center text-xs font-medium'>
								{item.slot_6 ? (
									<DivContent data={item.slot_6} />
								) : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
