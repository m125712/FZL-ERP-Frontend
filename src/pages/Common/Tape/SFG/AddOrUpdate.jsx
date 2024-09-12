import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeSFG } from '@/state/Common';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import { TAPE_STOCK_ADD_NULL, TAPE_STOCK_ADD_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useCommonTapeSFG();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		Controller,
		getValues,
	} = useRHF(TAPE_STOCK_ADD_SCHEMA, TAPE_STOCK_ADD_NULL);

	useFetchForRhfReset(
		`${url}/${updateTapeProd?.uuid}`,
		updateTapeProd?.uuid,
		reset
	);

	const { value: item } = useFetch(`/other/order-properties/by/item`);
	const { value: zipper_number } = useFetch(
		`/other/order-properties/by/zipper_number`
	);
	const isImportOption = [
		{
			label: 'Import ',
			value: false,
		},
		{
			label: 'Local ',
			value: true,
		},
	];
	const isReverseOption = [
		{ label: 'Reverse', value: true },
		{ label: 'Forward', value: false },
	];
	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			type: '',
			zipper_number: null,
			quantity: null,
			trx_quantity_in_coil: null,
			quantity_in_coil: null,
			remarks: '',
		}));
		reset(TAPE_STOCK_ADD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		//console.log(data);
		if (
			updateTapeProd?.uuid !== null &&
			updateTapeProd?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateTapeProd?.uuid}`,
				uuid: updateTapeProd?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			quantity: 0,
			trx_quantity_in_coil: 0,
			quantity_in_coil: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={`${updateTapeProd?.uuid ? 'Tape Update' : 'Tape Add'}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			<Textarea label='name' title='Name' {...{ register, errors }} />
			<div className='flex flex-col gap-2 md:flex-row'>
				<FormField label='item_uuid' title='Item' errors={errors}>
					<Controller
						name={'item_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={item}
									value={item?.filter(
										(item) =>
											item.value == getValues('item_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='zipper_number_uuid'
					title='Zipper Number'
					errors={errors}>
					<Controller
						name={'zipper_number_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Zipper Number'
									options={zipper_number}
									value={zipper_number?.filter(
										(item) =>
											item.value ==
											getValues('zipper_number_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='is_import' title='Is Import' errors={errors}>
					<Controller
						name={'is_imported'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Is Import? '
									options={isImportOption}
									value={isImportOption?.filter(
										(item) =>
											item.value ==
											getValues('is_imported')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='is_reverse'
					title='Is Reverse'
					errors={errors}>
					<Controller
						name={'is_reverse'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Is Reverse ?'
									options={isReverseOption}
									value={isReverseOption?.filter(
										(item) =>
											item.value ==
											getValues('is_reverse')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			<div className='flex flex-col gap-2 md:flex-row'>
				<Input label='top' title='Top' {...{ register, errors }} />
				<Input
					label='bottom'
					title='Bottom'
					{...{ register, errors }}
				/>
				<Input
					label='raw_mtr_per_kg'
					title='Raw Tape (Meter/Kg)'
					{...{ register, errors }}
				/>
				<Input
					label='dyed_mtr_per_kg'
					title='Dyed Tape (Meter/Kg)'
					{...{ register, errors }}
				/>
			</div>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
