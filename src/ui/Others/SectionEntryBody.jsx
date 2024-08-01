export default function BodyTemplate({ title, header, children }) {
	return (
		<div className="rounded-md bg-primary text-secondary-content">
			<div className="my-1 mr-2 flex items-center justify-between">
				<span className="flex items-center gap-4 px-2 py-1.5 text-lg font-semibold capitalize text-primary-content">
					{title}
				</span>
				{header}
			</div>
			<div className="flex flex-col gap-1.5 rounded-md border border-primary bg-white p-2 text-secondary-content">
				{children}
			</div>
		</div>
	);
}
