// ===== IMPORTS SECTION =====
import { lazy, Suspense, useEffect, useState } from 'react';
// Custom Hooks
import { useAuth } from '@/context/auth';
import { useComplainByUUID, useOrderDetailsByStyleForPDF } from '@/state/Order';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useFetchFunc, useRHF } from '@/hooks';

// ===== LAZY LOADED COMPONENTS =====

import OrderSheetPdf from '@/components/Pdf/OrderSheet';
import OrderSheetByStyle from '@/components/Pdf/OrderSheetByStyle';
import OrderSheetByStyleV3 from '@/components/Pdf/OrderSheetByStyleV3';
// Utilities
import { ShowLocalToast } from '@/components/Toast';

import nanoid from '@/lib/nanoid';
import GetDateTime from '@/util/GetDateTime';
import { COMPLAIN_NULL, COMPLAIN_SCHEMA } from '@/util/Schema';

const InformationSkeleton = lazy(
	() => import('../_components/Information/skeleton')
);
const ComplainBox = lazy(() => import('./ComplainBox'));
const SingleInformation = lazy(() => import('../_components/Information'));
const Table = lazy(() => import('../_components/Table'));
const Timeline = lazy(() => import('../_components/Timeline'));

// ===== CONSTANTS =====
let MAX_FILES = 3;

const INITIAL_TOTALS = {
	Quantity: 0,
	PlanningBatch: 0,
	piQuantity: 0,
	deliveryQuantity: 0,
	warehouseQuantity: 0,
	rejectQuantity: 0,
	finishingBalance: 0,
	shortQuantity: 0,
	tapeQuantity: 0,
	sliderQuantity: 0,
	companyPrice: 0,
	partyPrice: 0,
};

// ===== UTILITY FUNCTIONS =====
const createPDF = (pdfdata, setGetPdfData, PdfGenerator) => {
	const res = PdfGenerator(pdfdata);
	res.getDataUrl((dataUrl) => {
		setGetPdfData(dataUrl);
	});
};

const calculateOrderTotals = (orderEntries, orderType) => {
	if (!orderEntries?.length) return INITIAL_TOTALS;

	return orderEntries.reduce(
		(totals, item) => {
			const priceMultiplier = orderType !== 'tape' ? 1 / 12 : 1;

			totals.Quantity += parseFloat(item.quantity) || 0;
			totals.PlanningBatch +=
				parseFloat(item.planning_batch_quantity) || 0;
			totals.piQuantity += parseFloat(item.total_pi_quantity) || 0;
			totals.deliveryQuantity +=
				parseFloat(item.total_delivery_quantity) || 0;
			totals.warehouseQuantity +=
				parseFloat(item.total_warehouse_quantity) || 0;
			totals.rejectQuantity +=
				parseFloat(item.total_reject_quantity) || 0;
			totals.finishingBalance += parseFloat(item.finishing_balance) || 0;
			totals.shortQuantity += parseFloat(item.total_short_quantity) || 0;
			totals.tapeQuantity += parseFloat(item.dying_and_iron_prod) || 0;
			totals.sliderQuantity += parseFloat(item.coloring_prod) || 0;
			totals.companyPrice +=
				parseFloat(
					item.quantity * (item.company_price * priceMultiplier)
				) || 0;
			totals.partyPrice +=
				parseFloat(
					item.quantity * (item.party_price * priceMultiplier)
				) || 0;

			return totals;
		},
		{ ...INITIAL_TOTALS }
	);
};

const createOrderInfo = (order) => ({
	id: order?.id,
	pi_numbers: order?.pi_numbers,
	is_bill: order?.is_bill,
	is_cash: order?.is_cash,
	is_sample: order?.is_sample,
	is_inch: order?.is_inch,
	order_status: order?.order_status,
	order_number: order?.order_number,
	party_name: order?.party_name,
	buyer_name: order?.buyer_name,
	marketing_name: order?.marketing_name,
	merchandiser_name: order?.merchandiser_name,
	factory_name: order?.factory_name,
	factory_address: order?.factory_address,
	user_name: order?.user_name,
	marketing_priority: order?.marketing_priority,
	factory_priority: order?.factory_priority,
	revisions: order?.revision_no,
	updated_at: order?.updated_at,
	created_at: order?.created_at,
});

// ===== CUSTOM HOOKS =====
const useOrderData = (order_description_uuid, initial_order) => {
	const [order, setOrder] = useState(initial_order || []);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (order_description_uuid !== undefined) {
			useFetchFunc(
				`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`,
				setOrder,
				setLoading,
				setError
			);
		} else {
			setLoading(false);
		}
	}, [order_description_uuid]);

	return { order, loading, error };
};

const usePDFGeneration = (
	order,
	garments,
	sr,
	orderbystyle,
	order_description_uuid
) => {
	const [getPdfData, setGetPdfData] = useState(null);
	const [getPdfData2, setGetPdfData2] = useState(null);
	const [getPdfData3, setGetPdfData3] = useState(null);

	useEffect(() => {
		if (order?.order_entry?.length > 0 && order_description_uuid) {
			const order_info = createOrderInfo(order);

			const order_sheet = {
				order_info,
				order_entry: [order],
				garments,
				sr,
			};

			const orderByStyle = {
				order_info,
				sr,
				garments,
				orders: orderbystyle?.pageData,
			};

			createPDF(order_sheet, setGetPdfData, OrderSheetPdf);
			createPDF(orderByStyle, setGetPdfData2, OrderSheetByStyle);
			createPDF(orderByStyle, setGetPdfData3, OrderSheetByStyleV3);
		}
	}, [order, garments, sr, order_description_uuid, orderbystyle]);

	return { getPdfData2 };
};

// ===== LOADING COMPONENTS =====
const LoadingSpinner = () => (
	<div className='flex items-center justify-center p-4'>
		<span className='loading loading-dots loading-lg' />
	</div>
);

const FormLoadingSkeleton = () => (
	<div className='animate-pulse space-y-4 p-4'>
		<div className='h-4 w-3/4 rounded bg-gray-200'></div>
		<div className='h-32 rounded bg-gray-200'></div>
		<div className='h-4 w-1/2 rounded bg-gray-200'></div>
	</div>
);

// ===== SUBCOMPONENTS =====
const PDFPreviewSection = ({
	getPdfData2,
	form,
	handleSubmit,
	onSubmit,
	register,
	errors,
	control,
	getValues,
	Controller,
	setValue,
	existingFileUrls,
}) => (
	<div className='grid grid-cols-2 gap-4'>
		<div className='h-[55rem] w-full rounded-md border-none'>
			<FormProvider {...form}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'
				>
					<Suspense fallback={<FormLoadingSkeleton />}>
						<ComplainBox
							register={register}
							errors={errors}
							control={control}
							getValues={getValues}
							Controller={Controller}
							setValue={setValue}
							MAX_FILES={MAX_FILES}
							FileCount={
								getValues('file')
									? JSON?.parse(getValues('file'))?.length
									: 1
							}
							existingFileUrls={existingFileUrls}
						/>
					</Suspense>
				</form>
			</FormProvider>
		</div>
		<div className='flex h-[55rem] w-full gap-6 rounded-md border-none'>
			<iframe
				id='iframeContainer2'
				src={getPdfData2}
				className='w-full'
				title='PDF Preview 2'
			/>
		</div>
	</div>
);

// ===== MAIN COMPONENT =====
export default function Index({ initial_order, idx }) {
	// ===== URL PARAMETERS =====
	const { order_number, order_description_uuid, uuid } = useParams();
	const navigation = useNavigate();

	// ===== AUTHENTICATION =====
	const { user } = useAuth();
	const [existingFileUrls, setExistingFileUrls] = useState([]);

	// ===== DATA FETCHING =====
	const { order, loading } = useOrderData(
		order_description_uuid,
		initial_order
	);

	const {
		data: complainData,
		url,
		postData,
		updateData,
		imageUpdateData,
		invalidateQuery: invalidateComplain,
	} = useComplainByUUID(uuid);

	const { data: garments } = useOtherOrderPropertiesByGarmentsWash({
		enabled: !!order_description_uuid,
	});

	const { data: orderbystyle } = useOrderDetailsByStyleForPDF(
		order_number,
		order_description_uuid
	);

	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement({
		enabled: !!order_description_uuid,
	});

	// ===== PDF GENERATION =====
	const { getPdfData2 } = usePDFGeneration(
		order,
		garments,
		sr,
		orderbystyle,
		order_description_uuid
	);

	// ===== FORM HANDLING =====
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		setValue,
		context: form,
	} = useRHF(COMPLAIN_SCHEMA, {
		...COMPLAIN_NULL,
		file_1: null,
		file_2: null,
		file_3: null,
	});
	const navigatie = useNavigate();

	// ===== COMPUTED VALUES =====
	const hasInitialOrder = Object.keys(initial_order || []).length > 0;
	const total = calculateOrderTotals(order?.order_entry, order?.order_type);

	// ===== SIDE EFFECTS =====
	useEffect(() => {
		document.title = order_number;
	}, [order_number]);

	useEffect(() => {
		if (uuid !== undefined && complainData?.file) {
			const fileArray = JSON.parse(complainData.file) || [];

			const resetData = {
				...complainData,
			};

			reset(resetData);

			setExistingFileUrls(fileArray);
		}
	}, [uuid, complainData, reset]);

	// ===== EVENT HANDLERS =====
	const onSubmit = async (data) => {
		const formData = new FormData();

		// Arrays to track files
		const newFiles = [];
		const existingFileUrls = [];

		for (let i = 1; i <= MAX_FILES; i++) {
			const fileKey = `file_${i}`;
			const fileValue = data[fileKey];

			if (!fileValue) {
				continue;
			}

			if (fileValue instanceof File) {
				// New file upload
				newFiles.push(fileValue);
				formData.append('file', fileValue);
			} else {
				// Existing file URL
				existingFileUrls.push(fileValue);
			}

			// Clean up from data object
			delete data[fileKey];
		}

		if (
			newFiles.length === 0 &&
			existingFileUrls.length === 0 &&
			!data?.file
		) {
			ShowLocalToast({
				type: 'error',
				message: 'Please upload at least one file',
			});
			return;
		}

		// Prepare submission data
		const submissionData = {
			is_resolved: data?.is_resolved,
			description: data?.description || '',
			future_proof: data?.future_proof || '',
			issue_department: data?.issue_department || '',
			name: data?.name || '',
			remarks: data?.remarks || '',
			root_cause_analysis: data?.root_cause_analysis || '',
			solution: data?.solution || '',
			order_description_uuid: order_description_uuid,
		};

		// Add metadata for file upload
		if (existingFileUrls.length > 0) {
			formData.append('file_string', JSON.stringify(existingFileUrls));
		}
		formData.append('updated_by', user?.uuid);
		formData.append('updated_at', GetDateTime());

		// Pass preserved file URLs
		// if (uuid && JSON?.parse(data?.file).length > 0) {
		// 	formData.append(
		// 		'file_string',
		// 		JSON.stringify(JSON.parse(data?.file))
		// 	);
		// }

		try {
			if (uuid) {
				// Update existing complaint
				await updateData.mutateAsync({
					url: `/public/complaint/${uuid}`,
					updatedData: {
						...submissionData,
						uuid,
						updated_by: user?.uuid,
						updated_at: GetDateTime(),
						is_resolved_date:
							data?.is_resolved === complainData?.is_resolved
								? data?.is_resolved_date
								: data?.is_resolved
									? GetDateTime()
									: null,
					},
					isOnCloseNeeded: false,
				});

				// Only upload files if there are new ones
				if (newFiles.length > 0 || existingFileUrls.length > 0) {
					await imageUpdateData.mutateAsync({
						url: `/public/complaint-file/${uuid}`,
						uuid: uuid,
						updatedData: formData,
						isOnCloseNeeded: false,
					});
				}
			} else {
				// Create new complaint
				const new_uuid = nanoid();

				await postData.mutateAsync({
					url: '/public/complaint',
					newData: {
						...submissionData,
						uuid: new_uuid,
						created_by: user?.uuid,
						created_at: GetDateTime(),
						is_resolved_date: data?.is_resolved
							? GetDateTime()
							: null,
					},
					isOnCloseNeeded: false,
				});

				await imageUpdateData.mutateAsync({
					url: `/public/complaint-file/${new_uuid}`,
					uuid: new_uuid,
					updatedData: formData,
					isOnCloseNeeded: false,
				});
			}

			reset(COMPLAIN_NULL);
			await invalidateComplain();
			navigation(
				`/order/details/${order_number}/${order_description_uuid}`
			);
		} catch (error) {
			console.error('Submission error:', error);
			ShowLocalToast({
				type: 'error',
				message: 'Failed to submit complaint',
			});
		}
	};

	// ===== LOADING & ERROR STATES =====
	if (loading) {
		return <LoadingSpinner />;
	}

	if (!order) {
		return <Navigate to='/not-found' />;
	}

	// ===== RENDER =====
	return (
		<div className='space-y-4'>
			{/* PDF Preview Section */}
			{order_description_uuid && (
				<PDFPreviewSection
					getPdfData2={getPdfData2}
					form={form}
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					register={register}
					errors={errors}
					control={control}
					getValues={getValues}
					Controller={Controller}
					setValue={setValue}
					existingFileUrls={existingFileUrls}
				/>
			)}

			{/* Order Information Section */}
			<Suspense fallback={<InformationSkeleton />}>
				<SingleInformation
					idx={idx}
					order={order}
					updateData={updateData}
					hasInitialOrder={hasInitialOrder}
				/>
			</Suspense>

			{/* Timeline and Table Section */}
			<Suspense fallback={<LoadingSpinner />}>
				<Timeline {...order} />
				<Table {...order} index={idx} total={total} />
			</Suspense>
		</div>
	);
}
