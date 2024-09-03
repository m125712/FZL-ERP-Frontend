export default function BodyTemplate({ title, header, children }) {
	return (
		<div className='rounded-md bg-primary text-primary-content'>
			<div className='mr-2 flex items-center justify-between'>
				<span className='flex items-center gap-4 px-4 py-3 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>
				{header}
			</div>
			<div className='flex flex-col gap-1.5 space-y-2 border border-t-0 border-secondary/30 bg-base-100 p-4 text-secondary-content'>
				{children}
			</div>
		</div>
	);
}
