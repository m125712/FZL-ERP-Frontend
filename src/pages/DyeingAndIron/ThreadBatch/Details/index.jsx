import { useEffect, useMemo, useState } from 'react';
import BatchSheetPdf from '@components/Pdf/ThreadBulkRecipe';
import TravelingCard from '@components/Pdf/ThreadTravelCard';
import { Navigate, useParams } from 'react-router-dom';
import { useAccess, useFetch, useFetchFunc } from '@/hooks';

import Information from './Information';
import SecondTable from './SecondTable';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { value: batch, loading } = useFetch(
		`/thread/batch-details/by/${batch_uuid}`,
		[batch_uuid]
	);
	const machine_uuid = batch?.machine_uuid;

	const { value: machine } = useFetch(`/public/machine/${machine_uuid}`, [
		machine_uuid,
	]);
	const shade_recipe_uuids = batch?.batch_entry[0]?.recipe_uuid;

	const { value: shade_recipe } = useFetch(
		`/lab-dip/recipe/details/${shade_recipe_uuids}`,
		[shade_recipe_uuids, batch_uuid]
	);
	const volume =
		parseFloat(batch?.yarn_quantity) * parseFloat(batch?.water_capacity);

	const shade_recipes_entries = useMemo(() => {
		return shade_recipe?.recipe_entry?.map((item) => ({
			...item,
			bulk: Number((volume * item?.quantity).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	const programs = useMemo(() => {
		return shade_recipe?.programs?.map((item) => ({
			...item,
			bulk: Number((volume * parseFloat(item?.quantity)).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	// ! FOR TESTING
	const [data, setData] = useState('');

	useEffect(() => {
		if (batch && batch?.batch_entry) {
			BatchSheetPdf(batch, shade_recipes_entries, programs)?.getDataUrl(
				(dataUrl) => {
					setData(dataUrl);
				}
			);
		}
	}, [batch, programs, shade_recipes_entries]);
	const [data2, setData2] = useState('');
	useEffect(() => {
		if (batch && batch?.batch_entry) {
			TravelingCard(batch, shade_recipes_entries, programs)?.getDataUrl(
				(dataUrl) => {
					setData2(dataUrl);
				}
			);
		}
	}, [batch, programs, shade_recipes_entries]);
	// ! FOR TESTING

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-6'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>

			<Information
				batch={batch}
				water_capacity={machine?.water_capacity}
			/>
			<Table {...batch} />
			<SecondTable
				batch_entry={batch?.batch_entry}
				water_capacity={machine?.water_capacity}
				yarn_quantity={batch?.yarn_quantity}
			/>
		</div>
	);
}
