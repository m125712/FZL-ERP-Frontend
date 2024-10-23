import { useFetch } from '@/hooks';

export function TopTenSalesMan(props) {
	const { value: data, loading } = useFetch(props?.url, [props?.url]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex w-64 flex-col rounded-md border bg-base-200 shadow'>
			<div className='rounded-t-md bg-secondary py-2 text-center text-primary-content'>
				Top 10 Salesman
			</div>
			<div className='flex flex-col'>
				{data.map((item, index) => (
					<AttendanceItem
						key={index}
						name={item.name}
						sale={item.sales}
						docCollected={item.doc_collect}
					/>
				))}
			</div>
		</div>
	);
}

function AttendanceItem({ name, sale, docCollected }) {
	return (
		<div className='flex items-center gap-4 border-b border-gray-300 px-3 py-3'>
			<div className='h-12 w-12 rounded-full border border-black'></div>
			<div>
				<h4 className='text-sm font-semibold'>{name}</h4>
				<div className='text-xs text-gray-600'>Sale: ${sale}</div>
				<div className='text-xs text-gray-600'>
					Doc collected: ${docCollected}
				</div>
			</div>
		</div>
	);
}
