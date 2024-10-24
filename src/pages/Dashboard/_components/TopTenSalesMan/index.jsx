import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useFetch } from '@/hooks';

export function TopTenSalesMan(props) {
	const [status, setStatus] = useState(false);
	const { value: data, loading } = useFetch(props?.url, [props?.url, status]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex w-64 flex-col rounded-md border bg-base-200 shadow'>
			<div className='flex items-center justify-between rounded-t-md bg-secondary px-3 py-2 text-primary-content'>
				<span>Top 10 Salesman</span>
				<button
					type='button'
					className='btn-filter-outline bg-white'
					onClick={() => setStatus((prev) => !prev)}>
					<RefreshCcw className='size-4' />
				</button>
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
