import { useCallback, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { useOrderStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useAccess } from '@/hooks';

import OrderSheetPdf from '@/components/Pdf/OrderStatement';
import PdfGeneratorButton from '@/components/ui/generate-pdf-button';

import Header from './Header';

function removeFunctions(obj) {
	if (Array.isArray(obj)) {
		return obj.map(removeFunctions);
	} else if (obj && typeof obj === 'object') {
		const newObj = {};
		for (const key in obj) {
			if (typeof obj[key] !== 'function') {
				newObj[key] = removeFunctions(obj[key]);
			}
		}
		return newObj;
	}
	return obj;
}
const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const [from, setFrom] = useState(() => format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(() => format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState('');
	const [type, setType] = useState('');
	const [party, setParty] = useState('');
	const { data: garments } = useOtherOrderPropertiesByGarmentsWash();
	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement();
	const { data, isLoading, isFetching, refetch } = useOrderStatementReport(
		from,
		to,
		party,
		marketing,
		type,

		getPath(haveAccess, user?.uuid),
		{
			isEnabled: !!user?.uuid,
		}
	);
	const {
		isGenerating,
		progress,
		status,
		pdfUrl,
		error,
		generatePdf,
		reset,
	} = usePdfGenerator();
	const handleGenerateClick = useCallback(async () => {
		if (isFetching || isGenerating) return;
		reset();

		const result = await refetch();
		const { data } = result;
		const { data: value } = data;
		if (value) {
			generatePdf(
				removeFunctions(OrderSheetPdf(value, garments, sr, from, to))
			);
		}
	}, [isFetching, isGenerating, refetch, generatePdf, reset, from, to]);

	return (
		<div className='flex flex-col gap-8'>
			<Header
				{...{
					from,
					setFrom,
					to,
					setTo,
					marketing,
					setMarketing,
					type,
					setType,
					party,
					setParty,
					isLoading,
				}}
			/>
			<PdfGeneratorButton
				handleGenerateClick={handleGenerateClick}
				isFetching={isFetching}
				isGenerating={isGenerating}
				pdfUrl={pdfUrl}
				download={true}
				viewPdf={true}
				status={status}
				pdf_name={`order_statement_${marketing}_${type}_${party}_(${from}-${to}) `}
				progress={progress}
				error={error}
			/>
			{/* <button
					type='button'
					onClick={() => Excel(data, from, to)}
					className='btn btn-secondary flex-1'>
					Excel
				</button> */}
		</div>
	);
}
