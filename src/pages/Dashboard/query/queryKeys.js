export const dashboardQK = {
	all: () => ['dashboard'],

	order_entry: (from, to) => [...dashboardQK.all(), 'order-entry', from, to],

	work_in_hand: () => [...dashboardQK.all(), 'work-in-hand'],

	amount_and_doc: () => [...dashboardQK.all(), 'amount-and-doc'],
	amount_percentage: () => [...dashboardQK.all(), 'amount-percentage'],
	no_of_doc: () => [...dashboardQK.all(), 'no-of-doc'],

	payment_due: () => [...dashboardQK.all(), 'payment-due'],
	maturity_due: () => [...dashboardQK.all(), 'maturity-due'],
	acceptance_due: () => [...dashboardQK.all(), 'acceptance-due'],
	document_rcv_due: () => [...dashboardQK.all(), 'document-rcv-due'],
};
