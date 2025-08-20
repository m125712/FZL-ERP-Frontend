import { useCallback } from 'react';
import { useAuth } from '@/context/auth';

import Formdata from '@/util/formData';

import { useVoucher } from '../../config/query';

export const useVoucherSubmission = ({
	isUpdate,
	uuid,
	navigate,
	nanoid,
	GetDateTime,
	reset,
	VOUCHER_NULLABLE,
	purchaseDescriptionUrl,
}) => {
	const { postData, updateData } = useVoucher();
	const { user } = useAuth();

	return useCallback(
		async (data) => {
			try {
				if (isUpdate) {
					// 1) Update the voucher itself
					const voucher_data = {
						...data,
						updated_at: GetDateTime(),
						updated_by: user?.uuid,
					};
					delete voucher_data.voucher_entry;

					await updateData.mutateAsync({
						url: `${purchaseDescriptionUrl}/${data.uuid}`,
						updatedData: voucher_data,
						uuid: data.uuid,
						isOnCloseNeeded: false,
					});

					// 2) Prepare entries
					const newEntries = (data.voucher_entry || [])
						.filter((item) => !item.uuid)
						.map((item, idx) => {
							const entryUuid = nanoid();
							const base = {
								...item,
								index: idx,
								uuid: entryUuid,
								voucher_uuid: data.uuid,
								created_at: GetDateTime(),
								created_by: user?.uuid,
							};

							return {
								...base,
								voucher_entry_cost_center: (
									item.voucher_entry_cost_center || []
								).map((cc, i) => ({
									...cc,
									index: i,
									uuid: nanoid(),
									voucher_entry_uuid: entryUuid,
									created_at: GetDateTime(),
									created_by: user?.uuid,
								})),
								voucher_entry_payment: (
									item.voucher_entry_payment || []
								).map((p, i) => ({
									...p,
									index: i,
									uuid: nanoid(),
									voucher_entry_uuid: entryUuid,
									created_at: GetDateTime(),
									created_by: user?.uuid,
								})),
							};
						});

					const updatedEntries = (data.voucher_entry || [])
						.filter((item) => item.uuid)
						.map((item, idx) => ({
							...item,
							index: idx,
							voucher_uuid: data.uuid,
							updated_at: GetDateTime(),
							updated_by: user?.uuid,
							voucher_entry_cost_center: (
								item.voucher_entry_cost_center || []
							).map((cc, i) => ({
								...cc,
								index: i,
								voucher_entry_uuid: item.uuid,
								...(cc.uuid
									? {
											updated_at: GetDateTime(),
											updated_by: user?.uuid,
										}
									: {
											uuid: nanoid(),
											created_at: GetDateTime(),
											created_by: user?.uuid,
										}),
							})),
							voucher_entry_payment: (
								item.voucher_entry_payment || []
							).map((p, i) => ({
								...p,
								index: i,
								voucher_entry_uuid: item.uuid,
								...(p.uuid
									? {
											updated_at: GetDateTime(),
											updated_by: user?.uuid,
										}
									: {
											uuid: nanoid(),
											created_at: GetDateTime(),
											created_by: user?.uuid,
										}),
							})),
						}));

					// 3) Process updated entries
					for (const entry of updatedEntries) {
						const {
							voucher_entry_cost_center,
							voucher_entry_payment,
							...entryData
						} = entry;

						await updateData.mutateAsync({
							url: `/acc/voucher-entry/${entry.uuid}`,
							updatedData: entryData,
							isOnCloseNeeded: false,
						});

						// Cost centers
						if (voucher_entry_cost_center.length > 0) {
							const newCostCenters =
								voucher_entry_cost_center.filter(
									(cc) => !cc.uuid
								);
							const updatedCostCenters =
								voucher_entry_cost_center.filter(
									(cc) => cc.uuid
								);

							if (newCostCenters.length > 0) {
								await postData.mutateAsync({
									url: `/acc/voucher-entry-cost-center`,
									newData: newCostCenters,
									isOnCloseNeeded: false,
								});
							}

							for (const cc of updatedCostCenters) {
								await updateData.mutateAsync({
									url: `/acc/voucher-entry-cost-center/${cc.uuid}`,
									updatedData: cc,
									isOnCloseNeeded: false,
								});
							}
						}

						// Payments
						if (voucher_entry_payment.length > 0) {
							const newPayments = voucher_entry_payment.filter(
								(p) => !p.uuid
							);
							const updatedPayments =
								voucher_entry_payment.filter((p) => p.uuid);

							if (newPayments.length > 0) {
								await postData.mutateAsync({
									url: `/acc/voucher-entry-payment`,
									newData: newPayments,
									isOnCloseNeeded: false,
								});
							}

							for (const p of updatedPayments) {
								await updateData.mutateAsync({
									url: `/acc/voucher-entry-payment/${p.uuid}`,
									updatedData: p,
									isOnCloseNeeded: false,
								});
							}
						}
					}

					// 4) Process brand-new entries
					for (const entry of newEntries) {
						const {
							voucher_entry_cost_center,
							voucher_entry_payment,
							...entryData
						} = entry;

						await postData.mutateAsync({
							url: `/acc/voucher-entry`,
							newData: [entryData],
							isOnCloseNeeded: false,
						});

						if (voucher_entry_cost_center.length > 0) {
							await postData.mutateAsync({
								url: `/acc/voucher-entry-cost-center`,
								newData: voucher_entry_cost_center,
								isOnCloseNeeded: false,
							});
						}

						if (voucher_entry_payment.length > 0) {
							await postData.mutateAsync({
								url: `/acc/voucher-entry-payment`,
								newData: voucher_entry_payment,
								isOnCloseNeeded: false,
							});
						}
					}

					reset(VOUCHER_NULLABLE);
					if (uuid) {
						navigate(`/accounting/voucher/${uuid}/details`);
					}
				} else {
					// CREATE new voucher
					const voucherUuid = nanoid();
					const created_at = GetDateTime();
					const created_by = user?.uuid;

					const voucher_data = {
						...data,
						uuid: voucherUuid,
						created_at,
						created_by,
					};
					delete voucher_data.voucher_entry;

					const formData = Formdata({ ...voucher_data });
					await postData.mutateAsync({
						url: purchaseDescriptionUrl,
						newData: formData,
						isOnCloseNeeded: false,
					});

					// Create each entry under the new voucher
					const entries = data.voucher_entry || [];
					for (const [idx, entry] of entries.entries()) {
						const entryUuid = nanoid();
						const {
							voucher_entry_cost_center,
							voucher_entry_payment,
							...voucherEntryData
						} = entry;

						const entryPayload = {
							...voucherEntryData,
							index: idx,
							voucher_uuid: voucherUuid,
							uuid: entryUuid,
							created_at,
							created_by,
						};

						await postData.mutateAsync({
							url: `/acc/voucher-entry`,
							newData: [entryPayload],
							isOnCloseNeeded: false,
						});

						if (voucher_entry_cost_center?.length > 0) {
							const ccPayload = voucher_entry_cost_center.map(
								(cc, i) => ({
									...cc,
									index: i,
									uuid: nanoid(),
									voucher_entry_uuid: entryUuid,
									created_at,
									created_by,
								})
							);
							await postData.mutateAsync({
								url: `/acc/voucher-entry-cost-center`,
								newData: ccPayload,
								isOnCloseNeeded: false,
							});
						}

						if (voucher_entry_payment?.length > 0) {
							const pPayload = voucher_entry_payment.map(
								(p, i) => ({
									...p,
									index: i,
									uuid: nanoid(),
									voucher_entry_uuid: entryUuid,
									created_at,
									created_by,
								})
							);
							await postData.mutateAsync({
								url: `/acc/voucher-entry-payment`,
								newData: pPayload,
								isOnCloseNeeded: false,
							});
						}
					}

					reset(VOUCHER_NULLABLE);
					navigate(`/accounting/voucher/${voucherUuid}/details`);
				}
			} catch (err) {
				console.error(`Voucher submission error: ${err}`);
			}
		},
		[
			GetDateTime,
			VOUCHER_NULLABLE,
			isUpdate,
			navigate,
			nanoid,
			postData,
			purchaseDescriptionUrl,
			uuid,
			reset,
			updateData,
			user?.uuid,
		]
	);
};
