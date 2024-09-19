import cn from '@/lib/cn';
import { Plus } from 'lucide-react';

export default function DynamicField({
	title = '',
	tableHead,
	tableHeadClass = '',
	headerButtons = [],
	handelAppend,
	children,
}) {
	return (
		<div className='rounded bg-primary text-primary-content'>
			<div className='flex items-center justify-between px-4 py-3'>
				<span className='flex items-center gap-4 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>

				<div className='flex gap-4 items-center'>
					{headerButtons.length > 0 && headerButtons.map((e) => e)}	

				{handelAppend && (
					<button
						type='button'
						className='btn btn-accent btn-xs rounded'
						onClick={handelAppend}>
						<Plus className='w-5' /> NEW
					</button>
				)}
				</div>
			</div>


			
			<div className='overflow-x-auto rounded-b border border-t-0 border-primary/30 bg-base-100 text-left text-sm text-primary'>
				<table className='w-full'>
					<thead
						className={cn(
							'select-none text-sm text-primary-content',
							tableHeadClass
						)}>
						<tr className='rounded-md capitalize text-primary'>
							{tableHead}
						</tr>
					</thead>
					<tbody>{children}</tbody>
				</table>
			</div>
		</div>
	);
}

export function DynamicDeliveryField({
	title = '',
	tableHead,
	handelAppend,
	children,
}) {
	return (
		<div>
			<div className='flex items-center justify-between rounded-md rounded-b-none bg-primary px-4 py-3'>
				<h4 className='text-lg font-semibold capitalize text-primary-content'>
					{title}
				</h4>
				{handelAppend && (
					<button
						type='button'
						className='btn btn-secondary btn-xs border border-white bg-secondary'
						onClick={handelAppend}>
						<Plus className='w-4 text-primary' /> NEW
					</button>
				)}
			</div>

			<div className='overflow-x-auto rounded-b-md border border-t-0 border-secondary/30'>
				<table className='w-full'>
					<thead>
						<tr className='select-none whitespace-nowrap bg-secondary text-left text-sm font-semibold tracking-wide text-secondary-content'>
							{tableHead}
						</tr>
					</thead>
					<tbody className='divide-y divide-secondary/30'>
						{children}
					</tbody>
				</table>
			</div>
		</div>
	);
}
