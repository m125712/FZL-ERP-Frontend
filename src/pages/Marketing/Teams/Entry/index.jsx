import { Suspense, useEffect, useState } from 'react';
import { useMarketingTeamDetails, useMarketingTeams } from '@/state/Marketing';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { MARKETING_TEAM_NULL, MARKETING_TEAM_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import DynamicEntry from './DynamicEntry';
import Header from './Header';

export default function Index() {
	const { team_uuid } = useParams();

	const { data, updateData, postData, deleteData } =
		useMarketingTeamDetails(team_uuid);
	const { invalidateQuery: marketingTeams } = useMarketingTeams();

	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = team_uuid !== undefined;

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
	} = useRHF(MARKETING_TEAM_SCHEMA, MARKETING_TEAM_NULL);

	// manual_pi_entry
	const {
		fields: MarketingEntries,
		append: MarketingEntriesAppend,
		remove: MarketingEntriesRemove,
	} = useFieldArray({
		control,
		name: 'marketing_team_entry',
	});

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [isUpdate, data]);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(MARKETING_TEAM_NULL);
	// Submit
	const onSubmit = async (data) => {
		//Update
		if (isUpdate) {
			const marketing_team_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			if (data.marketing_team_entry.length === 0) {
				ShowLocalToast({
					type: 'error',
					message: 'Must add at least one Marketing Team Entry',
				});
			} else {
				const marketing_team_data_updated_promise =
					await updateData.mutateAsync({
						url: `/public/marketing-team/${data?.uuid}`,
						updatedData: marketing_team_data_updated,
						isOnCloseNeeded: false,
					});

				const marketing_team_entry_data_updated_promise =
					data.marketing_team_entry.map(async (item) => {
						if (item.uuid === undefined) {
							await postData.mutateAsync({
								url: '/public/marketing-team-entry',
								newData: {
									...item,
									uuid: nanoid(),
									marketing_team_uuid: data.uuid,
									created_at: GetDateTime(),
									created_by: user.uuid,
								},
								isOnCloseNeeded: false,
							});
						} else {
							return await updateData.mutateAsync({
								url: `/public/marketing-team-entry/${item.uuid}`,
								updatedData: {
									...item,
									updated_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						}
					});

				try {
					await Promise.all([
						marketing_team_data_updated_promise,
						...marketing_team_entry_data_updated_promise,
					])
						.then(() => reset(MARKETING_TEAM_NULL))
						.then(() => {
							navigate(`/commercial/manual-pi/${data?.uuid}`);
						});
				} catch (err) {
					console.error(`Error with Promise.all: ${err}`);
				}
			}
			return;
		}

		// Add new item
		const marketing_team_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create Shade Recipe description
		const marketing_team_data = {
			...data,
			uuid: marketing_team_uuid,
			created_at,
			created_by,
		};

		if (data.marketing_team_entry.length === 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Must add at least one Marketing Team Entry',
			});
		} else {
			const marketing_team_data_promise = await postData.mutateAsync({
				url: '/public/marketing-team',
				newData: marketing_team_data,
				isOnCloseNeeded: false,
			});

			const marketing_team_entry_data_promise = [
				...data.marketing_team_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/public/marketing-team-entry',
							newData: {
								...item,
								uuid: nanoid(),
								marketing_team_uuid,
								created_at,
								created_by,
							},
							isOnCloseNeeded: false,
						})
				),
			];

			try {
				await Promise.all([
					marketing_team_data_promise,
					...marketing_team_entry_data_promise,
				])
					.then(() => reset(MARKETING_TEAM_NULL))
					.then(() => {
						marketingTeams();
						// navigate(`/commercial/manual-pi/${new_manual_pi_uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// Check if uuid is valuuid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
		ENTER: 'enter',
	};

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<Header
					{...{
						register,
						errors,
					}}
				/>

				<DynamicEntry
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						watch,
						setValue,
						MarketingEntries,
						MarketingEntriesAppend,
						MarketingEntriesRemove,
						setDeleteItem,
					}}
				/>

				<Footer buttonClassName='!btn-primary' />
			</form>
			<Suspense>
				<DeleteModal
					modalId={'marketing_team_entry_delete_modal'}
					title={'Delete Marketing Team Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={MarketingEntries}
					url={'/public/marketing-team-entry'}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
