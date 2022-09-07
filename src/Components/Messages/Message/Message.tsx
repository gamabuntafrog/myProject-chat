import React, { useState, useEffect, MutableRefObject, Dispatch, FC } from "react";
import { gifMessageType, messagesType, messageType } from "../../../types/messages";
import { user } from "../../../types/user";
import { userStylesType } from "../../../App";
import { showRepliedMessageActionTypes } from "../../Chat/Chat";
import { Box, Button, IconButton, ImageList, ImageListItem, ListItem, TextField, Typography } from "@mui/material";
import { activeUsername, dateMessage, messageContainer, messageLeftLine, messageListItem, messageStyles, messageWrapper, userRole, userWrapper } from "../MessagesStyles";
import ReplyIcon from "@mui/icons-material/Reply";
import WhoSeenTheMessage from "../WhoSeenTheMessage";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import EllipsisText from "react-ellipsis-text";

type MessagePT = {
	message: messageType,
	onOpenContextMenu: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement, MouseEvent>, message: messagesType, subscribedUser: user) => void,
	isLastMessage: boolean,
	lastMessage: MutableRefObject<HTMLLIElement | null>,
	subscribedUser: user,
	isMobile: boolean,
	isMessageBeforeIsMine: boolean,
	isMessageAfterThisMine: boolean,
	userStyles: userStylesType
	showRepliedMessage: (message: (messageType | gifMessageType), actionType: showRepliedMessageActionTypes) => void,
	currentUser: user,
	subscribedReplyerUser: user | null,
	subscribedUsers: any,
	replyMessage: messageType | gifMessageType | null,
	setGalleryImages: Dispatch<{ original: string, thumbnail: string }[] | null>,
	setIsGalleryOpen: Dispatch<boolean>,
	replyOnMessage: any,
	showUserInfo: any,
	setIndexOfOpenedImage: any
}

const Message: FC<MessagePT> = (
	{
		message,
		onOpenContextMenu,
		isLastMessage,
		lastMessage,
		subscribedUser,
		subscribedUsers,
		isMobile,
		isMessageBeforeIsMine,
		isMessageAfterThisMine,
		userStyles,
		showRepliedMessage,
		currentUser,
		subscribedReplyerUser,
		replyMessage,
		setGalleryImages,
		setIsGalleryOpen,
		replyOnMessage,
		showUserInfo,
		setIndexOfOpenedImage
	}
) => {


	const [messageInputValue, setMessageInputValue] = useState(message.message);
	const [isChanging, setIsChanging] = useState(false);

	const { messageType, messageId, replyer, createdAt, userId } = message;

	const formattedCreatedAt = format(createdAt, "HH mm").split(" ").join(":");
	const changedAtFormatted = message?.changedAt ? format(message.changedAt, "HH mm").split(" ").join(":") : null;

	const nicknameColor = () => {
		// `${subscribedReplyerUser?.userId === currentUser.userId ? currentUser?.nicknameColor || "" : subscribedReplyerUser?.nicknameColor || ""} !important`
		if (subscribedReplyerUser?.userId === currentUser.userId) {
			return currentUser.nicknameColor || "white";
		} else {
			return subscribedReplyerUser?.nicknameColor || "white";
		}
	};

	const isMessageChanging = false;

	return (
		<ListItem
			sx={{ padding: 0 }}
			key={messageId}
			onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
			ref={isLastMessage ? lastMessage : null}
			onClick={() => setIsChanging(true)}
		>
			<Box
				className={"messageWrapper"}
				sx={messageListItem(isMobile)}
			>
				<Box
					className='message'
					sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}
				>
					{!isChanging ?
						<>
							<Box sx={userWrapper}>
								{!isMessageBeforeIsMine &&
								<>
									<Typography
										onClick={(e) => showUserInfo(e, subscribedUser)}
										sx={activeUsername(subscribedUser ? subscribedUser?.nicknameColor : "")}
										variant='subtitle1'
									>
										{subscribedUser?.nickname || userId}
									</Typography>
									{subscribedUser?.isAdmin &&
									<Typography variant='subtitle1' sx={userRole}>
										Админ
									</Typography>
									}
								</>
								}
								<IconButton
									className='miniContextmenu'
									onClick={() => {
										replyOnMessage(message);
									}}
									sx={{ color: subscribedUser?.nicknameColor || "" }}
								>
									<ReplyIcon/>
								</IconButton>
							</Box>
							{replyer &&
							<Box sx={messageContainer}>
								<Box sx={messageLeftLine}/>
								<Box
									onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
									sx={{ cursor: "pointer" }}
								>
									<Typography
										sx={{
											color: nicknameColor(),
											cursor: "pointer"
										}}
									>
										{subscribedReplyerUser?.nickname}
									</Typography>
									{replyMessage ?
										<EllipsisText
											sx={messageStyles}
											text={replyMessage.message}
											length={30}
										/>
										:
										<Typography color='error' sx={{}}>Сообщение
											удалено
										</Typography>
									}
								</Box>
							</Box>
							}
							{message.images &&
							<ImageList
								sx={isMobile ? { width: "100%" } : {}}
								cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length}
							>
								{message.images.map(({ imageRef, url }, i) => {
									return <ImageListItem
										onClick={() => {
											setIndexOfOpenedImage(i);
											setGalleryImages(message.images!.map(({ url }) => {
												return {
													original: url,
													thumbnail: url
												};
											}));
											setIsGalleryOpen(true);
										}}
										key={url}
										sx={{
											borderRadius: 2,
											overflow: "hidden",
											mt: 1,
											mx: 0.5,
											cursor: "pointer"
										}}
									>
										<img style={{ height: "300px" }} src={url}/>
									</ImageListItem>;
								})}
							</ImageList>
							}
							<Typography sx={messageStyles}>
								{message.message}
							</Typography>
							{changedAtFormatted ?
								<Typography sx={dateMessage}>
									изменено в {changedAtFormatted}
								</Typography>
								:
								<Typography sx={dateMessage}>
									{formattedCreatedAt}
								</Typography>
							}
							{isLastMessage &&
							<WhoSeenTheMessage message={message} currentUserId={currentUser.userId} subscribedUsers={subscribedUsers}/>
							}
						</>
						:
						<Box>
							<Box
								onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
								sx={{
									display: "flex",
									wordBreak: "break-all",
									cursor: "pointer"
								}}
							>
								{message.replyer &&
								<Box sx={messageContainer}>
									<Box sx={messageLeftLine}/>
									<Box
										onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
										sx={{ cursor: "pointer" }}
									>
										<Typography
											sx={{
												color: nicknameColor(),
												cursor: "pointer"
											}}
										>
											{subscribedReplyerUser?.nickname}
										</Typography>
										{replyMessage ?
											<EllipsisText
												sx={messageStyles}
												text={replyMessage.message}
												length={30}
											/>
											:
											<Typography color='error' sx={{}}>Сообщение
												удалено
											</Typography>
										}
									</Box>
								</Box>
								}
							</Box>
							{message.images &&
							<ImageList
								sx={isMobile ? { width: "100%" } : {}}
								cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length}
							>
								{message.images.map(({ imageRef, url }, i) => {
									return <ImageListItem
										onClick={() => {
											setIndexOfOpenedImage(i);
											setGalleryImages(message.images!.map(({ url }) => {
												return {
													original: url,
													thumbnail: url
												};
											}));
											setIsGalleryOpen(true);
										}}
										key={url}
										sx={{
											borderRadius: 2,
											overflow: "hidden",
											mt: 1,
											mx: 0.5,
											cursor: "pointer"
										}}
									>
										<img style={{ height: "300px" }} src={url}/>
									</ImageListItem>;
								})}
							</ImageList>
							}
							<TextField
								fullWidth
								sx={{ div: { px: 1, mb: 1 } }}
								variant={"standard"}
								onChange={(e) => setMessageInputValue(e.target.value)}
								multiline defaultValue={message.message}
							/>
							<Button
								sx={{ mx: 1 }}
								color={"success"}
								onClick={() => {
									// changeMessage(message);
									console.log(message);
								}}>
								<DoneIcon/>
							</Button>
							<Button
								color={"error"}
								onClick={() => {
									// setChangingMessageId("");
									setMessageInputValue("");
								}}
							>
								<CloseIcon/>
							</Button>

						</Box>
					}
				</Box>
			</Box>
		</ListItem>
	);
};

export default Message;