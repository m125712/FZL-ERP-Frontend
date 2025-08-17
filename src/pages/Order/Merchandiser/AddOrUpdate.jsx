import { useAuth } from '@/context/auth';
import { useOrderMerchandiser } from '@/state/Order';
import { useOtherMerchandiserByPartyUUID, useOtherParty } from '@/state/Other';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { MERCHANDISER_NULL, MERCHANDISER_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateMerchandiser = {
		uuid: null,
		party_uuid: null,
	},
	setUpdateMerchandiser,
}) {
	const { url, updateData, postData } = useOrderMerchandiser();
	const { invalidateQuery: invalidateMerchandiserByPartyUUID } =
		useOtherMerchandiserByPartyUUID();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
	} = useRHF(MERCHANDISER_SCHEMA, MERCHANDISER_NULL);

	const { data: party } = useOtherParty();
	const { user } = useAuth();

	useFetchForRhfReset(
		`${url}/${updateMerchandiser?.uuid}`,
		updateMerchandiser?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateMerchandiser((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(MERCHANDISER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		let party_name = party.find(
			(item) => item.value === data.party_uuid
		).label;

		// Update item
		if (
			updateMerchandiser?.uuid !== null &&
			updateMerchandiser?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				party_name: party_name,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			};
			await updateData.mutateAsync({
				url: `${url}/${updateMerchandiser?.uuid}`,
				uuid: updateMerchandiser?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			party_name: party_name,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateMerchandiserByPartyUUID();
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateMerchandiser?.uuid !== null
					? 'Update Merchandiser'
					: 'Merchandiser'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='party_uuid' title='Party' errors={errors}>
				<Controller
					name={'party_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Party'
								options={party}
								value={party?.filter(
									(item) =>
										item.value === getValues('party_uuid')
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label='name' {...{ register, errors }} />
			<Input label='email' {...{ register, errors }} />
			<Input label='phone' {...{ register, errors }} />
			<Textarea label='address' rows={2} {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
