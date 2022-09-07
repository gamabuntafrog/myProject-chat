import React, { useState, useEffect, FC, Dispatch, MutableRefObject } from "react";
import { gifMessageType, messagesExemplar, messagesType, messageType } from "../../../types/messages";
import { Box, IconButton, ListItem, Typography } from "@mui/material";
import { dateMessage, messageContainer, messageLeftLine, messageListItem, messageStyles, messageWrapper } from "../MessagesStyles";
import { showRepliedMessageActionTypes } from "../../Chat/Chat";
import ReplyIcon from "@mui/icons-material/Reply";
import WhoSeenTheMessage from "../WhoSeenTheMessage";
import { user } from "../../../types/user";
import { userStylesType } from "../../../App";
import EllipsisText from "react-ellipsis-text";
import { format } from "date-fns";
import MessageReference from "../MessageReference";

type GifMessagePT = {
	message: gifMessageType,
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
	replyOnMessage: any
}

const GifMessage: FC<GifMessagePT> = (
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
		replyOnMessage
	}
) => {

	// const [testState, setTestState] = useState(false);

	const { messageType, messageId, replyer, createdAt } = message;

	const formattedCreatedAt = format(createdAt, "HH mm").split(" ").join(":");

	const nicknameColor = () => {
		// `${subscribedReplyerUser?.userId === currentUser.userId ? currentUser?.nicknameColor || "" : subscribedReplyerUser?.nicknameColor || ""} !important`
		if (subscribedReplyerUser?.userId === currentUser.userId) {
			return currentUser.nicknameColor || 'white'
		} else {
			return subscribedReplyerUser?.nicknameColor || 'white'
		}
	}


	return (
		<ListItem
			sx={{ padding: 0 }}
			key={messageId}
			onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
			ref={isLastMessage ? lastMessage : null}
			// onClick={() => setTestState(!testState)}
		>
			<Box
				className={"messageWrapper"}
				sx={messageListItem(isMobile)}
			>
				<Box
					className='message'
					sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}
				>
					{replyer &&
						<MessageReference
							message={message}
							showRepliedMessage={showRepliedMessage}
							nicknameColor={nicknameColor}
							subscribedReplyerUser={subscribedReplyerUser}
							replyMessage={replyMessage}
						/>
					}
					<Box
						sx={{ padding: 0 }}
						onClick={() => {
							setGalleryImages([{
								original: message.gifInfo.media_formats.gif.url,
								thumbnail: message.gifInfo.media_formats.gif.url
							}]);
							setIsGalleryOpen(true);
						}}
					>
						<img
							style={{
								borderRadius: message.replyer ? `0 ${userStyles.messagesBorderRadius}px ${userStyles.messagesBorderRadius}px ${userStyles.messagesBorderRadius}px` : `${userStyles.messagesBorderRadius}px`,
								cursor: "pointer",
								height: "300px",
								maxWidth: "100%"
							}}
							src={message.gifInfo.media_formats.mediumgif.url}
						/>
					</Box>
					<Typography sx={dateMessage}>
						{formattedCreatedAt}
					</Typography>
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
				{isLastMessage &&
				<WhoSeenTheMessage message={message} currentUserId={currentUser.userId} subscribedUsers={subscribedUsers}/>
				}
			</Box>
		</ListItem>
	);


	return (
		<Box/>
	)
}

export default GifMessage