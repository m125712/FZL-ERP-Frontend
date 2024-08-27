import { useFetch } from '@/hooks';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Information from './Information';
import Table from './Table';

export default function Index() {
	const { shade_recipe_uuid } = useParams();

	const { value: data, loading } = useFetch(
		`/lab-dip/shade-recipe-details/by/${shade_recipe_uuid}`,
		[shade_recipe_uuid]
	);

	useEffect(() => {
		document.title = 'Shade Recipe Details';
	}, []);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!data) return <Navigate to='/not-found' />;

	return (
		<div className={'space-y-8'}>
			<Information data={data} />
			<Table {...data} />
		</div>
	);
}
