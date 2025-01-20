import { useEffect, useMemo, useState } from 'react';
import { useDyeingBatchDetailsByUUID } from '@/state/Dyeing';
import { useLabDipRecipeDetailsByUUID } from '@/state/LabDip';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import secondPdf from '@/components/Pdf/ZipperBulkRecipe';
import Pdf from '@/components/Pdf/ZipperTravelCard';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { batch_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	const { data: batch, loading } = useDyeingBatchDetailsByUUID(batch_uuid);

	useEffect(() => {
		document.title = 'Planning Batch Details';
	}, []);

	// if (!planningSNO) return <Navigate to='/not-found' />;
	const [data, setData] = useState('');
	const [secondData, setSecondData] = useState('');
	const shade_recipe_uuids = batch?.batch_entry[0]?.recipe_uuid;

	const volume = 1;
	const { data: shade_recipe } =
		useLabDipRecipeDetailsByUUID(shade_recipe_uuids);
	const shade_recipes_entries = useMemo(() => {
		return shade_recipe?.recipe_entry?.map((item) => ({
			...item,
			quantity: Number(item?.quantity).toFixed(3),
			bulk: Number((volume * item?.quantity).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	const programs = useMemo(() => {
		return shade_recipe?.programs?.map((item) => ({
			...item,
			quantity: Number(item?.quantity).toFixed(3),
			bulk: Number((volume * item?.quantity).toFixed(3)),
		}));
	}, [shade_recipe, volume]);

	useEffect(() => {
		if (batch && batch?.dyeing_batch_entry) {
			Pdf(batch)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [batch]);
	useEffect(() => {
		if (batch && batch?.dyeing_batch_entry) {
			secondPdf(batch)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [batch]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<iframe
				src={secondData}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information batch={batch} />
			<Table {...batch} />
		</div>
	);
}
