import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

const EmptySlotCard = ({ dyeingDate, machine_uuid, slot_no }) => {
	let navigate = useNavigate();
	const url = {
		zipper: `/dyeing-and-iron/zipper-batch/entry?dyeing_date=${dyeingDate}&machine_uuid=${machine_uuid}&slot_no=${slot_no}`,
		thread: `/dyeing-and-iron/thread-batch/entry?dyeing_date=${dyeingDate}&machine_uuid=${machine_uuid}&slot_no=${slot_no}`,
	};

	return (
		<div className='absolute inset-0 grid size-full grid-cols-1'>
			<div className='flex size-full items-center justify-center transition-colors hover:cursor-pointer hover:bg-primary/5'>
				<button
					onClick={() => navigate(url.zipper)}
					className='btn btn-primary btn-xs gap-0.5'
				>
					<Plus className='size-4' />
					Zipper
				</button>
			</div>
			<div className='flex size-full items-center justify-center transition-colors hover:cursor-pointer hover:bg-primary/5'>
				<button
					onClick={() => navigate(url.thread)}
					className='btn btn-secondary btn-xs gap-0.5'
				>
					<Plus className='size-4' />
					Thread
				</button>
			</div>
		</div>
	);
};

export default EmptySlotCard;
