import React, { useState, useEffect, FC } from "react";
import { messageContainer, messageLeftLine, messageStyles } from "../MessagesStyles";
import { Box, Typography } from "@mui/material";
import { showRepliedMessageActionTypes } from "../../Chat/Chat";
import { gifMessageType, messageType } from "../../../types/messages";
import { user } from "../../../types/user";
import EllipsisText from "react-ellipsis-text";

type MessageReferencePT = {
	message: messageType | gifMessageType,
	showRepliedMessage: any,
	nicknameColor: () => any,
	subscribedReplyerUser: user | null,
	replyMessage: messageType | gifMessageType | null,
}

const MessageReference: FC<MessageReferencePT> = (
	{
		message,
		showRepliedMessage,
		nicknameColor,
		subscribedReplyerUser,
		replyMessage
	}
) => {

	return (
		<Box sx={{ ...messageContainer, mb: 1 }}>
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
						text={replyMessage?.message || ''}
						length={30}
					/>
					:
					<Typography color='error' sx={{}}>Сообщение
						удалено
					</Typography>
				}
			</Box>
		</Box>
	);
};

export default MessageReference;