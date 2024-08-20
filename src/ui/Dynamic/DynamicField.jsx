import { Add } from '@/assets/icons';
import cn from '@/lib/cn';

export default function DynamicField({
	title = '',
	tableHead,
	tableHeadClass = '',
	handelAppend,
	children,
}) {
	return (
		<div className='rounded bg-primary text-primary-content'>
			<div className='flex items-center justify-between px-4 py-3'>
				<span className='flex items-center gap-4 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>
				{handelAppend && (
					<button
						type='button'
						className='btn btn-secondary btn-xs rounded bg-secondary'
						onClick={handelAppend}>
						<Add className='w-4 text-primary' /> NEW
					</button>
				)}
			</div>
			<div className='overflow-x-auto rounded-b border border-primary/30 bg-white text-left text-sm text-primary'>
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
		<div className='rounded-md bg-primary text-primary-content'>
			<div className='my-2 mr-2 flex items-center justify-between'>
				<span className='flex items-center gap-4 px-2 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>
				{handelAppend && (
					<button
						type='button'
						className='btn btn-secondary btn-xs border border-white bg-secondary'
						onClick={handelAppend}>
						<Add className='w-4 text-primary' /> NEW
					</button>
				)}
			</div>

			<div className='overflow-x-auto rounded-md border border-primary bg-white text-left text-sm text-primary shadow-md'>
				<table className='w-full'>
					<thead className='select-none text-sm text-primary-content'>
						<tr className='rounded-md capitalize text-primary'>
							{tableHead}
						</tr>
					</thead>
					<tbody className='divide-y-2 divide-primary'>
						{children}
					</tbody>
				</table>
			</div>
		</div>
	);
}
