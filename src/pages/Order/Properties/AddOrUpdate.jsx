import { useAuth } from '@/context/auth';
import { useOrderProperties } from '@/state/Order';
import {
	useOtherOrderInfoValueLabel,
	useOtherOrderPropertiesByBottomStopper,
	useOtherOrderPropertiesByColor,
	useOtherOrderPropertiesByColoringType,
	useOtherOrderPropertiesByEndType,
	useOtherOrderPropertiesByEndUser,
	useOtherOrderPropertiesByGarmentsWash,
	useOtherOrderPropertiesByHand,
	useOtherOrderPropertiesByItem,
	useOtherOrderPropertiesByLightPreference,
	useOtherOrderPropertiesByLockType,
	useOtherOrderPropertiesByLogoType,
	useOtherOrderPropertiesByNylonStopper,
	useOtherOrderPropertiesByPullerLink,
	useOtherOrderPropertiesByPullerType,
	useOtherOrderPropertiesBySlider,
	useOtherOrderPropertiesBySliderBodyShape,
	useOtherOrderPropertiesBySliderLink,
	useOtherOrderPropertiesBySpecialRequirement,
	useOtherOrderPropertiesByTeethType,
	useOtherOrderPropertiesByTopStopper,
	useOtherOrderPropertiesByZipperNumber,
} from '@/state/Other';
import { DevTool } from '@hookform/devtools';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { PROPERTIES_NULL, PROPERTIES_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateOrderProperties = {
		uuid: null,
	},
	setUpdateOrderProperties,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useOrderProperties();
	const { data: item, invalidateQuery: invalidateOrderPropertiesByItem } =
		useOtherOrderPropertiesByItem();
	const { invalidateQuery: invalidateOrderPropertiesByZipperNumber } =
		useOtherOrderPropertiesByZipperNumber();
	const { invalidateQuery: invalidateOrderPropertiesByEndType } =
		useOtherOrderPropertiesByEndType();

	// * garments info*//
	const { invalidateQuery: invalidateOrderPropertiesByGarmentsWash } =
		useOtherOrderPropertiesByGarmentsWash();
	const { invalidateQuery: invalidateOrderPropertiesByLightPreference } =
		useOtherOrderPropertiesByLightPreference();
	const { invalidateQuery: invalidateOrderPropertiesByEndUser } =
		useOtherOrderPropertiesByEndUser();

	//* slider info*//
	const { invalidateQuery: invalidateOrderPropertiesBySliderBodyShape } =
		useOtherOrderPropertiesBySliderBodyShape();
	const { invalidateQuery: invalidateOrderPropertiesBySliderLink } =
		useOtherOrderPropertiesBySliderLink();

	const { invalidateQuery: invalidateOrderPropertiesByLockType } =
		useOtherOrderPropertiesByLockType();

	//* puller info*//
	const { invalidateQuery: invalidateOrderPropertiesByPullerType } =
		useOtherOrderPropertiesByPullerType();
	const { invalidateQuery: invalidateOrderPropertiesByPullerLink } =
		useOtherOrderPropertiesByPullerLink();
	const { invalidateQuery: invalidateOrderPropertiesByColor } =
		useOtherOrderPropertiesByColor();
	const { invalidateQuery: invalidateOrderPropertiesByHand } =
		useOtherOrderPropertiesByHand();
	const { invalidateQuery: invalidateOrderPropertiesByNylonStopper } =
		useOtherOrderPropertiesByNylonStopper();
	const { invalidateQuery: invalidateOrderPropertiesBySpecialRequirement } =
		useOtherOrderPropertiesBySpecialRequirement();
	const { invalidateQuery: invalidateOrderPropertiesByColoringType } =
		useOtherOrderPropertiesByColoringType();
	const { data: slider, invalidateQuery: invalidateOrderPropertiesBySlider } =
		useOtherOrderPropertiesBySlider();
	const { invalidateQuery: invalidateOrderPropertiesByTopStopper } =
		useOtherOrderPropertiesByTopStopper();
	const { invalidateQuery: invalidateOrderPropertiesByBottomStopper } =
		useOtherOrderPropertiesByBottomStopper();
	const { invalidateQuery: invalidateOrderPropertiesByLogoType } =
		useOtherOrderPropertiesByLogoType();
	const { invalidateQuery: invalidateOrderPropertiesByTeethType } =
		useOtherOrderPropertiesByTeethType();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		context,
	} = useRHF(PROPERTIES_SCHEMA, PROPERTIES_NULL);

	useFetchForRhfReset(
		`${url}/${updateOrderProperties?.uuid}`,
		updateOrderProperties?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateOrderProperties((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(PROPERTIES_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateOrderProperties?.uuid !== null &&
			updateOrderProperties?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateOrderProperties?.uuid}`,
				uuid: updateOrderProperties?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at: GetDateTime(),
			updated_at: null,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateOrderPropertiesByItem();
		invalidateOrderPropertiesByZipperNumber();
		invalidateOrderPropertiesByEndType();
		invalidateOrderPropertiesByGarmentsWash();
		invalidateOrderPropertiesByLightPreference();
		invalidateOrderPropertiesByEndUser();
		invalidateOrderPropertiesBySliderBodyShape();
		invalidateOrderPropertiesBySliderLink();
		invalidateOrderPropertiesByLockType();
		invalidateOrderPropertiesByPullerType();
		invalidateOrderPropertiesByPullerLink();
		invalidateOrderPropertiesByColor();
		invalidateOrderPropertiesByHand();
		invalidateOrderPropertiesByNylonStopper();
		invalidateOrderPropertiesBySpecialRequirement();
		invalidateOrderPropertiesByColoringType();
		invalidateOrderPropertiesBySlider();
		invalidateOrderPropertiesByTopStopper();
		invalidateOrderPropertiesByBottomStopper();
		invalidateOrderPropertiesByLogoType();
		invalidateOrderPropertiesByTeethType();
	};

	const typeOptions = [
		{ value: 'bottom_stopper', label: 'Bottom Stopper' },
		{ value: 'color', label: 'Color' },
		{ value: 'coloring_type', label: 'Coloring Type' },
		{ value: 'end_type', label: 'End Type' },
		{ value: 'end_user', label: 'End User' },
		{ value: 'garments_wash', label: 'Garments Wash' },
		{ value: 'hand', label: 'Hand' },
		{ value: 'item', label: 'Item' },
		{ value: 'light_preference', label: 'Light Preference' },
		{ value: 'lock_type', label: 'Lock Type' },
		{ value: 'logo_type', label: 'Logo Type' },
		{ value: 'nylon_stopper', label: 'Nylon Stopper' },
		{ value: 'puller_type', label: 'Puller Type' },
		{ value: 'slider', label: 'Slider Material' },
		{ value: 'slider_body_shape', label: 'Slider Body Shape' },
		{ value: 'slider_link', label: 'Slider Link' },
		{ value: 'special_requirement', label: 'Special Requirement' },
		{ value: 'teeth_type', label: 'Teeth Type' },
		{ value: 'top_stopper', label: 'Top Stopper' },
		{ value: 'zipper_number', label: 'Zipper Number' },
	];

	const itemForOptions = [
		{ value: 'zipper', label: 'Zipper' },
		{ value: 'thread', label: 'Thread' },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateOrderProperties?.uuid !== null
					? 'Update Order Properties'
					: 'Order Properties'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField label='item_for' title='Item For' errors={errors}>
				<Controller
					name={'item_for'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Item For'
								options={itemForOptions}
								value={itemForOptions?.filter((item) =>
									getValues('item_for').includes(item.value)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={
									updateOrderProperties?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>

			<FormField label='type' title='Type' errors={errors}>
				<Controller
					name={'type'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Type'
								options={typeOptions}
								value={typeOptions?.filter(
									(item) => item.value === getValues('type')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
								isDisabled={
									updateOrderProperties?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>

			<Input label='name' {...{ register, errors }} />
			<Input label='short_name' {...{ register, errors }} />
			<Input label='order_sheet_name' {...{ register, errors }} />
			<Textarea rows={3} label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
