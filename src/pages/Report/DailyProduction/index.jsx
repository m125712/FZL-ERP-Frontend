import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionReportDateWise } from '@/state/Report';
import { format } from 'date-fns';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DailyProduction';
import PdfGeneratorButton from '@/components/ui/generate-pdf-button';

import PageInfo from '@/util/PageInfo';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__daily_production');
	const { user } = useAuth();

	const info = new PageInfo(
		'Daily Production',
		null,
		'report__daily_production'
	);

	const [from, setFrom] = useState(() => new Date());
	const [to, setTo] = useState(() => new Date());
	const [type, setType] = useState('all');
	const { data, isFetching, refetch, isLoading } =
		useProductionReportDateWise(
			format(from, 'yyyy-MM-dd HH:mm:ss'),
			format(to, 'yyyy-MM-dd HH:mm:ss'),
			type,
			getPath(haveAccess, user?.uuid),
			{
				enabled: !!user?.uuid,
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
			generatePdf(Pdf(value, from, to));
		}
	}, [isFetching, isGenerating, refetch, generatePdf, reset, from, to]);
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handleGenerateExcel = useCallback(async () => {
		if (isFetching) return;
		reset();

		const result = await refetch();
		const { data } = result;
		const { data: value } = data;
		if (value) {
			Excel(value, from, to);
		}
	}, [isFetching, isGenerating, refetch, reset, from, to]);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex flex-col gap-8'>
				<Header {...{ from, setFrom, to, setTo, type, setType }} />
				<div className='flex gap-2'>
					<div className='flex-1'>
						<PdfGeneratorButton
							handleGenerateClick={handleGenerateClick}
							isFetching={isFetching}
							isGenerating={isGenerating}
							pdfUrl={pdfUrl}
							status={status}
							download={false}
							viewPdf={true}
							progress={progress}
							pdf_name={`Daily_Production_${type}_(${format(from, 'yyyy-MM-dd')}-${format(to, 'yyyy-MM-dd')})`}
							error={error}
						/>
					</div>
					<button
						type='button'
						onClick={() => handleGenerateExcel()}
						className='btn btn-secondary flex-1'
					>
						Excel
					</button>
				</div>
			</div>
		</>
	);
}
