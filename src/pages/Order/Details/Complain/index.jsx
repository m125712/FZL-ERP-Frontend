// ===== IMPORTS SECTION =====
import { lazy, Suspense, useEffect, useState } from 'react';
// Custom Hooks
import { useAuth } from '@/context/auth';
import { useComplain, useOrderDetailsByStyleForPDF } from '@/state/Order';
import {
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesBySpecialRequirement,
} from '@/state/Other';
import { FormProvider } from 'react-hook-form';
import { Navigate, useParams } from 'react-router';
// State Management Hooks
import { useFetchFunc, useRHF } from '@/hooks';

// Components
import { Suspense as SuspenseFallback } from '@/components/Feedback';
import OrderSheetPdf from '@/components/Pdf/OrderSheet';
import OrderSheetByStyle from '@/components/Pdf/OrderSheetByStyle';
import OrderSheetByStyleV3 from '@/components/Pdf/OrderSheetByStyleV3';

// Utilities
import nanoid from '@/lib/nanoid';
import GetDateTime from '@/util/GetDateTime';
import { COMPLAIN_NULL, COMPLAIN_SCHEMA } from '@/util/Schema';

import InformationSkeleton from '../_components/Information/skeleton';
import ComplainBox from './ComplainBox';

// Lazy Components
const SingleInformation = lazy(() => import('../_components/Information'));
const Table = lazy(() => import('../_components/Table'));
const Timeline = lazy(() => import('../_components/Timeline'));

// ===== CONSTANTS & TYPES =====
const MAX_FILES = 3;

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

	const isEnabled =
		order_description_uuid !== null && order_description_uuid !== undefined;

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

	return { order, loading, error, isEnabled };
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

	return { getPdfData, getPdfData2, getPdfData3 };
};

const useFileManagement = (control, setValue, getValues) => {
	const [fileCount, setFileCount] = useState(1);

	const addFile = () => {
		if (fileCount < MAX_FILES) {
			setFileCount((prev) => prev + 1);
		}
	};

	const removeFile = (index) => {
		if (fileCount > 1) {
			setValue(`file_${index}`, null);

			// Shift remaining files up
			for (let i = index; i < fileCount - 1; i++) {
				const nextFile = getValues(`file_${i + 1}`);
				setValue(`file_${i}`, nextFile);
			}

			// Clear the last file field
			setValue(`file_${fileCount - 1}`, null);
			setFileCount((prev) => prev - 1);
		}
	};

	const hasFiles = () => {
		for (let i = 0; i < fileCount; i++) {
			if (getValues(`file_${i}`)) return true;
		}
		return false;
	};

	return { fileCount, addFile, removeFile, hasFiles };
};

// ===== SUBCOMPONENTS =====
const PDFPreviewSection = ({
	getPdfData,
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
}) => (
	<div className='grid grid-cols-2 gap-4'>
		<div className='flex h-[50rem] w-full gap-6 rounded-md border-none'>
			<iframe
				id='iframeContainer2'
				src={getPdfData2}
				className='w-full'
				title='PDF Preview 2'
			/>
		</div>
		<div className='h-[50rem] w-full rounded-md border-none'>
			<FormProvider {...form}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'
				>
					<ComplainBox
						register={register}
						errors={errors}
						control={control}
						getValues={getValues}
						Controller={Controller}
						setValue={setValue}
						MAX_FILES={MAX_FILES}
					/>
				</form>
			</FormProvider>
		</div>
	</div>
);

// ===== MAIN COMPONENT =====
export default function Index({ initial_order, idx }) {
	// ===== URL PARAMETERS =====
	const { order_number, order_description_uuid, uuid } = useParams();

	// ===== AUTHENTICATION =====
	const { user } = useAuth();

	// ===== DATA FETCHING =====
	const { order, loading, error, isEnabled } = useOrderData(
		order_description_uuid,
		initial_order
	);

	const {
		data: complainData,
		url,
		postData,
		invalidateQuery: invalidateComplain,
		onClose,
	} = useComplain();

	const { data: garments, updateData } =
		useOtherOrderPropertiesByGarmentsWash({
			enabled: isEnabled,
		});

	const { data: orderbystyle } = useOrderDetailsByStyleForPDF(
		order_number,
		order_description_uuid
	);

	const { data: sr } = useOtherOrderPropertiesBySpecialRequirement({
		enabled: isEnabled,
	});

	// ===== PDF GENERATION =====
	const { getPdfData, getPdfData2, getPdfData3 } = usePDFGeneration(
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
	} = useRHF(COMPLAIN_SCHEMA, COMPLAIN_NULL);

	// ===== COMPUTED VALUES =====
	const hasInitialOrder = Object.keys(initial_order || []).length > 0;
	const total = calculateOrderTotals(order?.order_entry, order?.order_type);

	// ===== SIDE EFFECTS =====
	useEffect(() => {
		document.title = order_number;
	}, [order_number]);

	useEffect(() => {
		if (uuid !== undefined) {
			reset(complainData);
		}
	}, [uuid, complainData, reset]);

	// ===== EVENT HANDLERS =====
	const onSubmit = async (data) => {
		const files = [];
		for (let i = 0; i < MAX_FILES; i++) {
			if (data[`file_${i}`]) {
				files.push(data[`file_${i}`]);
			}
			delete data[`file_${i}`];
		}

		const updatedData = {
			...data,
			files, // Add files array
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateComplain();
	};

	// ===== LOADING & ERROR STATES =====
	if (loading) {
		return <span className='loading loading-dots loading-lg z-50' />;
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
					getPdfData={getPdfData}
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
					MAX_FILES={MAX_FILES}
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
			<Suspense>
				<Timeline {...order} />
				<Table {...order} index={idx} total={total} />
			</Suspense>
		</div>
	);
}
