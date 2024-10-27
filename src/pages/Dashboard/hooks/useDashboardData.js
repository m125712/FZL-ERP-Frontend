import {
	fake_amount_and_doc,
	fake_amount_percentage,
	fake_no_of_doc,
	fake_order_entry,
} from '../fakeData';
import {
	useDashboardAcceptanceDue,
	useDashboardAmountAndDoc,
	useDashboardAmountPercentage,
	useDashboardDocumentRcvDue,
	useDashboardMaturityDue,
	useDashboardNoOfDoc,
	useDashboardOrderEntry,
	useDashboardPaymentDue,
} from '../query';

const useDashboardData = (dataPreview) => {
	const { data: amount_and_doc, refetch: amountAndDocRefetch } =
		useDashboardAmountAndDoc();
	const { data: order_entry, refetch: orderEntryRefetch } =
		useDashboardOrderEntry();
	const { data: payment_due, refetch: paymentDueRefetch } =
		useDashboardPaymentDue();
	const { data: acceptance_due, refetch: acceptanceDueRefetch } =
		useDashboardAcceptanceDue();
	const { data: maturity_due, refetch: maturityDueRefetch } =
		useDashboardMaturityDue();
	const { data: document_rcv_due, refetch: documentRcvDueRefetch } =
		useDashboardDocumentRcvDue();

	const { data: no_of_doc, refetch: noOfDocRefetch } = useDashboardNoOfDoc();
	const { data: amount_percentage, refetch: amountPercentageRefetch } =
		useDashboardAmountPercentage();

	if (dataPreview === 'demo') {
		return {
			amount_and_doc: fake_amount_and_doc,
			amount_percentage: fake_amount_percentage,
			no_of_doc: fake_no_of_doc,
			order_entry: fake_order_entry,
			payment_due,
			acceptance_due,
			maturity_due,
			document_rcv_due,
			refreshAll: () => {},
		};
	}

	return {
		amount_and_doc,
		amount_percentage,
		no_of_doc,
		order_entry,
		payment_due,
		acceptance_due,
		maturity_due,
		document_rcv_due,
		refreshAll: () => {
			amountAndDocRefetch();
			amountPercentageRefetch();
			noOfDocRefetch();
			orderEntryRefetch();
			paymentDueRefetch();
			acceptanceDueRefetch();
			maturityDueRefetch();
			documentRcvDueRefetch();
		},
	};
};

export default useDashboardData;
