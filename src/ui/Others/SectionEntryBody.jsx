export default function BodyTemplate({ title, header, children }) {
	return (
		<div className='rounded bg-primary text-secondary-content'>
			<div className='mr-2 flex items-center justify-between'>
				<span className='flex items-center gap-4 px-4 py-3 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>
				{header}
			</div>
			<div className='flex flex-col gap-1.5 rounded-b border border-primary/30 bg-white p-2 pb-4 text-secondary-content'>
				{children}
			</div>
		</div>
	);
}
