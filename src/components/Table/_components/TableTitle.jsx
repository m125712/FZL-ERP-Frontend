import { Info } from 'lucide-react';

const TableTitle = ({ title, subtitle, info }) => {
	return (
		<div className='flex items-start justify-between gap-2 md:justify-start'>
			<div className='flex flex-col'>
				<h1 className='flex gap-1 text-xl font-semibold capitalize leading-tight text-primary md:text-2xl'>
					{title}
					{info && (
						<div className='tooltip tooltip-right' data-tip={info}>
							<Info size={16} />
						</div>
					)}
				</h1>
				{subtitle && (
					<div className='mt-0.5 text-sm capitalize text-secondary'>
						{subtitle}
					</div>
				)}
			</div>
		</div>
	);
};

export default TableTitle;
