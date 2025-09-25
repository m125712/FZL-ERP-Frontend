'use client';

import React, { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
	Check,
	CornerDownLeft,
	Cross,
	Mic,
	Paperclip,
	Pencil,
	RefreshCw,
	Trash,
	X,
} from 'lucide-react';

import {
	ChatBubble,
	ChatBubbleAction,
	ChatBubbleActionWrapper,
	ChatBubbleAvatar,
	ChatBubbleMessage,
	ChatBubbleTimestamp,
} from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import {
	ExpandableChat,
	ExpandableChatBody,
	ExpandableChatFooter,
	ExpandableChatHeader,
} from '@/components/ui/chat/expandable-chat';

import { cn } from '@/lib/utils';

// Update the path below to the actual location of your auth context file
import { useAuth } from '../../context/auth';
import { ChatInterfaceProps, generateGroupedMessages, Message } from './utiils';

export default function ChatInterface({
	handleSend,
	form,
	data,
	deleteMessage,
	title,
	subTitle,
	refetch,
	editingMessageId,
	setEditingMessageId,
	position,
	size,
	onClick,
}) {
	const { user } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const shouldBlur = editingMessageId || isLoading;

	useEffect(() => {
		if (!isOpen) {
			setEditingMessageId(null);
			form.reset();
		}
		if (isOpen) refetch();
	}, [isOpen, refetch]);

	const onKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const startEditing = (msg) => {
		setEditingMessageId(msg.uuid);
		form.setValue('message', msg.message);
	};

	const saveEdit = (id) => {
		handleSend(id, form.watch('message'));
		form.reset();
		refetch();
		setEditingMessageId(null);
	};

	const cancelEdit = () => {
		setEditingMessageId(null);
		form.reset();
	};

	const handleEditKeyDown = (e, id) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			saveEdit(id);
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	};
	const handleSendMessage = async () => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			await handleSend();
			form.reset();
			refetch();
		} catch (error) {
			console.error('Failed to send message:', error);
			// Optional: Show toast/error message here
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (msg) => {
		// Now takes Message, extracts id internally
		if (isLoading) return;
		setIsLoading(true);
		try {
			deleteMessage(msg.uuid); // Extract uuid here
			refetch();
		} catch (error) {
			console.error('Failed to delete message:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClick = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		refetch();
		setIsLoading(false);
	};

	const actionIcons = [
		{
			icon: Pencil,
			type: 'edit',
			color: 'black',
			onClick: startEditing,
		},
		{
			icon: Trash,
			type: 'delete',
			color: 'red',
			onClick: handleDelete,
		},
	];
	const groupedMessages = useMemo(
		() => generateGroupedMessages(data),
		[data]
	);

	return (
		<div className='duration-250 flex h-full w-full flex-col overflow-hidden border bg-background shadow-md transition-all'>
			<ExpandableChatHeader className='shrink-0 flex-col justify-center text-center'>
				<div className='flex w-full items-center justify-between gap-2'>
					<div className='text-left'>
						<h1 className='text-xl font-semibold'>{title}</h1>
						<p className='text-sm'>{subTitle}</p>
					</div>
					<button
						aria-label='Refresh Data'
						onClick={(e) => handleClick(e)}
					>
						<RefreshCw
							className={cn(
								'size-4',
								isLoading && 'animate-spin'
							)}
						/>
						{/* <span className='hidden lg:inline'>Refresh</span> */}
					</button>
				</div>
			</ExpandableChatHeader>

			<ExpandableChatBody className='max-h-[50vh] flex-grow overflow-scroll'>
				<ChatMessageList smooth={true}>
					{groupedMessages.map((item, index) => {
						if (item.type === 'date') {
							return (
								<div
									key={`date-${index}`}
									className='my-2 flex justify-center'
								>
									<span className='rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-600'>
										{item.date}
									</span>
								</div>
							);
						}
						const variant =
							item.created_by === user?.uuid
								? 'sent'
								: 'received';
						const shouldBlurOut =
							shouldBlur && item.uuid === editingMessageId;

						return (
							<ChatBubble
								key={item.uuid}
								variant={variant}
								className={
									shouldBlur
										? shouldBlurOut
											? 'blur-out'
											: 'blur'
										: undefined
								}
							>
								<ChatBubbleAvatar
									fallback={
										item.page === 'repair' ? 'R' : 'D'
									}
								/>
								<ChatBubbleMessage
									isLoading={form.formState.isSubmitting}
									className={
										item.created_by === user?.uuid
											? 'bg-primary'
											: 'bg-secondary'
									}
								>
									{item.message}
									<br />
									<div className='flex items-center justify-end gap-2'>
										<span className='mt-2 text-right text-xs'>
											{item.created_by_name}
										</span>
										<ChatBubbleTimestamp
											timestamp={format(
												new Date(
													item?.created_at || ''
												),
												'hh:mm'
											)}
										/>

										{item.updated_at && (
											<span className='mt-2 text-right text-xs'>
												(Edited)
											</span>
										)}
									</div>
								</ChatBubbleMessage>
								<ChatBubbleActionWrapper>
									{actionIcons.map(
										({
											icon: Icon,
											color,
											type,
											onClick,
										}) =>
											variant === 'sent' &&
											!editingMessageId ? (
												<ChatBubbleAction
													key={type}
													className='size-7'
													icon={
														<Icon
															color={color}
															className='size-4'
														/>
													}
													onClick={(e) => {
														e.preventDefault();
														onClick(item);
													}}
												/>
											) : undefined
									)}
								</ChatBubbleActionWrapper>
							</ChatBubble>
						);
					})}
				</ChatMessageList>
			</ExpandableChatBody>
			<ExpandableChatFooter className='shrink-0'>
				<form className='relative rounded-lg border bg-background p-1 focus-within:ring-1 focus-within:ring-ring'>
					<ChatInput
						placeholder='Type your message here...'
						className='min-h-12 resize-none rounded-lg border-0 bg-background p-3 shadow-none focus-visible:ring-0'
						autoComplete='on'
						onKeyDown={
							editingMessageId
								? (e) => handleEditKeyDown(e, editingMessageId)
								: onKeyDown
						}
						{...form.register('message')}
					/>
					<div className='flex items-center p-3 pt-0'>
						{editingMessageId && (
							<div>
								<Button
									variant='ghost'
									size='icon'
									onClick={(e) => {
										e.preventDefault();
										saveEdit(editingMessageId);
									}}
								>
									<Check color='green' className='size-4' />
									<span className='sr-only'>Save</span>
								</Button>

								<Button
									variant='ghost'
									size='icon'
									onClick={(e) => {
										e.preventDefault();
										cancelEdit();
									}}
								>
									<X color='red' className='size-4' />
									<span className='sr-only'>Cancel</span>
								</Button>
							</div>
						)}
						{!editingMessageId && (
							<Button
								size='sm'
								className='ml-auto gap-1.5'
								onClick={handleSendMessage}
								disabled={isLoading}
							>
								{isLoading ? (
									<RefreshCw className='size-3.5 animate-spin' />
								) : (
									<>
										Send Message
										<CornerDownLeft className='size-3.5' />
									</>
								)}
							</Button>
						)}
					</div>
				</form>
			</ExpandableChatFooter>
		</div>
	);
}
