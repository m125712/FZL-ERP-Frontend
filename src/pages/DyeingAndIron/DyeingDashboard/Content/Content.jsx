import EmptySlotCard from './empty-slot-card';
import SlotCard from './slot-card';

export default function Content({ data, dyeingDate }) {
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
					<tr>
						{header?.map((item, index) => (
							<th
								key={index}
								className='w-32 bg-base-200 px-4 py-2 text-left text-sm font-semibold capitalize leading-tight text-primary'>
								{item}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr key={index} className='h-[100px] border'>
							<td className='overflow-hidden border border-primary/20 px-4 text-left text-xs font-medium'>
								{item.machine}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_1 ? (
									<SlotCard data={item.slot_1} />
								) : (
									<EmptySlotCard
										slot_no={1}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_2 ? (
									<SlotCard data={item.slot_2} />
								) : (
									<EmptySlotCard
										slot_no={2}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_3 ? (
									<SlotCard data={item.slot_3} />
								) : (
									<EmptySlotCard
										slot_no={3}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_4 ? (
									<SlotCard data={item.slot_4} />
								) : (
									<EmptySlotCard
										slot_no={4}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_5 ? (
									<SlotCard data={item.slot_5} />
								) : (
									<EmptySlotCard
										slot_no={5}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
							<td className='relative border border-primary/20 text-center text-xs font-medium'>
								{item.slot_6 ? (
									<SlotCard data={item.slot_6} />
								) : (
									<EmptySlotCard
										slot_no={6}
										machine_uuid={item.machine_uuid}
										dyeingDate={dyeingDate}
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
