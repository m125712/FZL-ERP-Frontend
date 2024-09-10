import cn from '@/lib/cn';
import { Plus } from 'lucide-react';

const AddButton = ({ onClick }) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className='btn-filter-accent gap-1'>
			<Plus className='size-5' />

			<span className='hidden lg:block'>New</span>
		</button>
	);
};

const Indicator = ({ value = -1, onClick }) => {
	if (value === -1) return <AddButton onClick={onClick} />;
	return (
		<div className='indicator'>
			<span className='badge indicator-item badge-error'>{value}</span>
			<AddButton onClick={onClick} />
		</div>
	);
};

function Title({ title, subtitle }) {
	return (
		<div className='flex items-start justify-between gap-2 md:justify-start'>
			<div className='flex flex-col'>
				<h1 className='text-xl font-semibold capitalize leading-tight text-primary md:text-2xl'>
					{title}
				</h1>
				<p className='mt-0.5 text-sm capitalize text-secondary'>
					{subtitle || 'See all records in one place'}
				</p>
			</div>
		</div>
	);
}

function TitleOnly({ title, subtitle }) {
	return (
		<div
			className={cn(
				'mb-0 flex items-center justify-between gap-2 rounded-t-md border border-b-0 border-secondary/30 bg-primary px-4 py-3 md:justify-start'
			)}>
			<div className='flex flex-col'>
				<h1
					className={cn(
						'text-2xl font-semibold capitalize leading-tight text-primary text-primary-content md:text-3xl'
					)}>
					{title}
				</h1>
				{subtitle && (
					<p className='-mt-1 text-[0.8rem] capitalize text-secondary-content'>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
}

export default Title;
export { AddButton, Indicator, TitleOnly };
