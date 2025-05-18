import { useEffect, useState } from 'react';
import { useDeliveryReturnQuantity } from '@/state/Delivery';
import { useOtherOrderEntryBy } from '@/state/Other';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { QUANTITY_RETURN_NULL, QUANTITY_RETURN_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import { Columns } from './columns';
import Header from './Header';

export default function Index() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [type, setType] = useState({});

	const { postData, invalidateQuery } = useDeliveryReturnQuantity();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
		context: form,
	} = useRHF(QUANTITY_RETURN_SCHEMA, QUANTITY_RETURN_NULL);

	const { fields: OrderDetailsField, remove: OrderDetailsFieldRemove } =
		useFieldArray({
			control,
			name: 'order_details',
		});

	const { data: orderData } = useOtherOrderEntryBy(
		watch('order_info_uuid'),
		type?.is_zipper
	);

	useEffect(() => {
		if (watch('order_info_uuid')) {
			setValue('order_details', orderData);
		}
	}, [reset, orderData]);

	const onSubmit = async (data) => {
		// * ADD data
		const created_at = GetDateTime();
		const created_by = user.uuid;

		const order_details_entry = [...data?.order_details]
			.filter(
				(item) => item.fresh_quantity > 0 || item.repair_quantity > 0
			)
			.map((item) => ({
				fresh_quantity: item.fresh_quantity,
				repair_quantity: item.repair_quantity,
				[type?.is_zipper
					? 'order_entry_uuid'
					: 'thread_order_entry_uuid']: item?.order_entry_uuid,
				challan_uuid: data?.challan_uuid,
				created_at,
				created_by,

				uuid: nanoid(),
			}));

		if (order_details_entry.length === 0) {
			ShowLocalToast({
				type: 'warning',
				message:
					'Please add at least one order detail with a fresh or repair quantity greater than 0.',
			});
		} else {
			let promises = await postData.mutateAsync({
				url: '/delivery/quantity-return',
				newData: order_details_entry,
				isOnCloseNeeded: false,
			});

			await Promise.all([promises])
				.then(() => {
					reset(Object.assign({}, QUANTITY_RETURN_NULL));
				})
				.then(() => {
					invalidateQuery();
					navigate(`/delivery/quantity-return`);
				})
				.catch((err) => console.log(err));

			return;
		}
		return;
	};

	const [deleteEntry, setDeleteEntry] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (index) => {
		const UUID = getValues(
			`dyeing_batch_entry[${index}].dyeing_batch_entry_uuid`
		);
		if (UUID !== undefined) {
			setDeleteEntry({
				itemId: UUID,
				itemName: UUID,
			});
			window['finishing_batch_entry_delete'].showModal();
		}
	};

	const currentColumns = Columns({
		setValue,
		OrderDetailsField,
		handelDelete,
		register,
		errors,
		watch,
		isZipper: type?.is_zipper,
	});

	return (
		<FormProvider {...form}>
			<form
				className='flex flex-col gap-8'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Header
					{...{
						Controller,
						register,
						errors,
						control,
						watch,
						getValues,
						setValue,
						reset,
						setType,
					}}
				/>

				<ReactTable
					title={'Orders Details'}
					data={OrderDetailsField}
					columns={currentColumns}
				/>

				<Footer buttonClassName='!btn-primary' />
			</form>

			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
