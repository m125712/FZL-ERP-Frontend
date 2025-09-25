import { format, isSameDay } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';

export interface Message {
	uuid: string;
	type?: 'date';
	date?: string;
	message: string;
	page: 'repair' | 'diagnosis';
	created_by_name?: string;
	order_uuid?: string;
	created_by?: string;
	created_at?: string;
	updated_at?: string | undefined;
}

export interface ChatInterfaceProps {
	handleSend: (editId?: string, editText?: string) => Promise<void>;
	form: UseFormReturn<{ message: string }, any, undefined>;
	data?: Message[] | undefined;
	deleteMessage: (id: string) => void;
	title: string;
	subTitle?: string;
	page?: 'repair' | 'diagnosis';
	refetch: () => void;
	editingMessageId: string | null;
	setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
	position?: 'bottom-right' | 'bottom-left';
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	onClick?: (e: any) => void;
}

export const generateGroupedMessages = (messages: Message[]) => {
	if (!messages || messages.length === 0) return [];

	// Sort messages by created_at (oldest to newest)
	const sortedMessages = [...messages].sort(
		(a, b) =>
			new Date(a.created_at || '').getTime() -
			new Date(b.created_at || '').getTime()
	);

	const grouped: (Message | { type: 'date'; date: string })[] = [];
	let currentDate: Date | null = null;

	sortedMessages.forEach((msg) => {
		const msgDate = new Date(msg.created_at || '');
		if (!currentDate || !isSameDay(currentDate, msgDate)) {
			grouped.push({
				type: 'date',
				date: format(msgDate, 'MMMM d, yyyy'),
			});
			currentDate = msgDate;
		}
		grouped.push(msg);
	});

	return grouped;
};
