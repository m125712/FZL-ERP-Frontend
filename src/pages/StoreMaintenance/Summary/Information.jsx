import { useEffect, useState } from 'react';
import { useFetchFunc } from '@/hooks';

import { TitleValue } from '@/ui';

export default function Information({ material_id }) {
	const [material, setMaterial] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		useFetchFunc(
			`/material/${material_id}`,
			setMaterial,
			setLoading,
			setError
		);
	}, [material_id]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='mb-4 flex flex-col gap-4 md:mx-4 md:flex-row'>
			<div className='flex flex-1 columns-2 flex-col rounded-md p-2 shadow-md'>
				<span className='text-2xl font-semibold text-secondary-content'>
					{material[0]?.name} ({material[0]?.short_name})
				</span>
				<hr className='border-1 my-2 border-secondary-content' />
				<div className='mx-2 flex flex-col justify-between md:flex-row'>
					<div className='flex flex-col gap-2'>
						<TitleValue
							title='Quantity'
							value={
								material[0]?.quantity + ' ' + material[0]?.unit
							}
						/>
						<TitleValue
							title='Threshold'
							value={
								material[0]?.threshold + ' ' + material[0]?.unit
							}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<TitleValue
							title='Section'
							value={material[0]?.section_name}
						/>
						<TitleValue
							title='Type'
							value={material[0]?.material_type}
						/>
					</div>
					<div className='flex flex-col gap-2'></div>
				</div>

				<div className='mx-2 flex flex-col justify-start md:flex-row'>
					<div className='grid grid-cols-1 gap-1 py-2 sm:gap-4 md:py-3'>
						<dt className='font-bold text-primary'>Description</dt>
						<dd className='text-gray-700'>
							{material[0]?.description || 'No Description'}
						</dd>
					</div>
				</div>
			</div>
		</div>
	);
}
