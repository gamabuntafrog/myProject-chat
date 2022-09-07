import React, {
	useState,
	useEffect,
	FC,
	SetStateAction,
	Dispatch,
	Ref,
	useRef,
	memo,
	useContext,
	useCallback
} from "react";
import { Box, Button, debounce, IconButton, ImageList, ImageListItem, TextField, Typography } from "@mui/material";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { screenTypes, useGetTypeOfScreen } from "../../hooks/useGetTypeOfScreen";
import { emojiType, gifType, updateQueryActionTypes } from "../Chat/Chat";
import { userStylesType } from "../../App";
import CloseIcon from "@mui/icons-material/Close";
import { CSSTransition } from "react-transition-group";
import "./Media.css";
import { collection, deleteDoc, doc, limit, orderBy, query, setDoc } from "firebase/firestore";
import { Context } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import shortid from "shortid";
import { gifMessageType, messagesExemplar, messageType } from "../../types/messages";

type MediaPT = {
	showGifs: boolean,
	setShowGifs: Dispatch<SetStateAction<boolean>>,
	onEmojiClick: (_: any, emojiObject: emojiType) => void,
	userStyles: userStylesType,
	setShowMedia: Dispatch<SetStateAction<boolean>>,
	showMedia: boolean,
	chatId: string,
	isReplying: boolean,
	setIsReplying: Dispatch<SetStateAction<boolean>>,
	replyMessageInfo: null | (messageType | gifMessageType) ,

}

const Media: FC<MediaPT> = memo(({
									 showGifs,
									 setShowGifs,
									 onEmojiClick,
									 userStyles,
									 setShowMedia,
									 showMedia,
									 chatId,
									 isReplying,
									 setIsReplying,
									 replyMessageInfo
								 }) => {

	const { isMobile, isTablet } = useGetTypeOfScreen();
	const { firestore, user } = useContext(Context)!;

	const sectionRef: Ref<HTMLElement | undefined> | null = useRef(null);

	const recentlyGifsRef = query(collection(firestore, "gifs", `${user!.userId}`, "recentlyGifs"), orderBy("createdAt", "desc"), limit(8));
	const [recentlyGifsData] = useCollectionData<any>(recentlyGifsRef);

	const savedGifsRef = query(collection(firestore, "gifs", `${user!.userId}`, "savedGifs"), orderBy("createdAt", "desc"), limit(50));
	const [savedGifsData] = useCollectionData<any>(savedGifsRef);


	const submitGifMessage = async (gif: gifType) => {
		const newMessageId = `${user?.userId}${shortid.generate()}${shortid.generate()}${Date.now()}`;

		if (isMobile) {
			setShowMedia(false);
		}

		console.log(gif);

		const userId = replyMessageInfo?.userId
		const messageId = replyMessageInfo?.messageId

		const message = {
			messageType: messagesExemplar.gifMessage,
			userId: user?.userId,
			message: "GIF",
			createdAt: Date.now(),
			messageId: newMessageId,
			chatId: chatId,
			gifInfo: gif,
			replyer: (isReplying && replyMessageInfo) ? {userId, messageId} : null
		};
		setIsReplying(false)

		await addRecentlyGif(gif);

		await setDoc(doc(firestore, "chats", chatId, "messages", newMessageId), message);

		await setDoc(doc(firestore, "chats", `${chatId}`), {
			lastMessage: message
		}, { merge: true });

	};

	const addRecentlyGif = async (gif: gifType) => {
		await setDoc(doc(firestore, "gifs", user!.userId, "recentlyGifs", gif.id), { ...gif, createdAt: Date.now() });
		if (recentlyGifsData?.length === 8) {
			deleteRecentlyGif(recentlyGifsData[7]);
		}
	};

	const saveGif = async (gif: gifType) => {
		await setDoc(doc(firestore, "gifs", user!.userId, "savedGifs", gif.id), { ...gif, createdAt: Date.now() });
		if (savedGifsData?.length === 50) {
			deleteSavedGif(savedGifsData[49]);
		}
	};

	const deleteRecentlyGif = async (gif: gifType) => {
		await deleteDoc(doc(firestore, "gifs", user!.userId, "recentlyGifs", gif.id));
	};

	const deleteSavedGif = async (gif: gifType) => {
		console.log(gif);
		await deleteDoc(doc(firestore, "gifs", user!.userId, "savedGifs", gif.id));
	};

	const [limitOfGifs, setLimitOfGifs] = useState(10);

	const [gifs, setGifs] = useState<null | gifType[]>(null);
	const [searchGifInputValue, setSearchGifInputValue] = useState<string>("");

	const updateQuery = (searchGifInputValue: string, limitOfGifs: number, actionType: updateQueryActionTypes) => {

		if (actionType === updateQueryActionTypes.makeNewQuery) {
			limitOfGifs = 10;
			setLimitOfGifs(10);
		}

		const fetchGifs = async () => {
			await fetch(`https://tenor.googleapis.com/v2/search?q=${searchGifInputValue || "hello"}&key=AIzaSyBNi2GDdp3ksixybEfxpNQM-Y0cs-fI8Ds&client_key=my_test_app&limit=${limitOfGifs}`)
				.then(data => data.json())
				.then(data => {
					console.log(data);
					setGifs(data.results);
				});

		};

		if (searchGifInputValue.trim() !== "") {
			fetchGifs();
		} else {
			setGifs(null);
		}

	};

	const debouncedUpdateQuery = React.useCallback(debounce(updateQuery, 300), []);

	return (
		<CSSTransition
			in={showMedia}
			timeout={300}
			classNames='media-section'
			nodeRef={sectionRef}
			mountOnEnter
			unmountOnExit
		>
			<Box component='section' ref={sectionRef} sx={isMobile ? {
					height: "70%",
					width: "100%",
					background: userStyles.secondBackgroundColor,
					borderLeft: "1px solid #363636",
					// height: 'auto',
					overflowY: "auto",
					position: "fixed",
					bottom: 0,
					zIndex: 100

				} :
				{
					width: isTablet ? "35%" : "20%",
					minWidth: isTablet ? "35%" : "20%",
					height: "auto",
					overflowY: "auto",
					borderLeft: "1px solid #363636"
				}
			}>
				<Box sx={{ display: "flex", justifyContent: "space-evenly", position: "sticky", top: 0, zIndex: 100, background: userStyles.secondBackgroundColor, py: 1 }}>
					<Button sx={{ width: "50%", borderRadius: 0 }} variant={!showGifs ? "contained" : "text"}
							onClick={() => setShowGifs(false)}>EMOJI</Button>
					<Button sx={{ width: "50%", borderRadius: 0 }} variant={showGifs ? "contained" : "text"}
							onClick={() => setShowGifs(true)}>GIF</Button>
					<Button onClick={() => setShowMedia(false)} sx={{ borderRadius: 0 }} color='error'>
						<CloseIcon/>
					</Button>
				</Box>
				{showGifs &&
				<>

					{recentlyGifsData && recentlyGifsData.length > 0 &&
					<>
						<Typography sx={{ textAlign: "center" }}>
							Недавние
						</Typography>
						<ImageList cols={3} gap={6} sx={{ padding: 1, overflowY: "auto" }}>
							{recentlyGifsData.map((gif: gifType) => {
								return (
									<ImageListItem className='media__list-item' sx={{ overflow: "hidden", borderRadius: 1, cursor: "pointer" }} key={gif.id}>
										<img onClick={() => submitGifMessage(gif)} src={gif.media_formats.nanogif.url}/>
										<Box className='media__list-item-buttons' sx={{ position: "absolute", top: 3, right: 3, display: "flex" }}>
											<IconButton onClick={() => saveGif(gif)} sx={{ color: "yellow" }}>
												<StarOutlineIcon/>
											</IconButton>
											<IconButton onClick={() => deleteRecentlyGif(gif)} color='error'>
												<CloseIcon/>
											</IconButton>
										</Box>
									</ImageListItem>
								);
							})}
						</ImageList>
					</>
					}
					{savedGifsData && savedGifsData.length > 0 &&
					<>
						<Typography sx={{ textAlign: "center" }}>
							Сохранённые
						</Typography>
						<ImageList cols={3} gap={6} sx={{ padding: 1, overflowY: "auto" }}>
							{savedGifsData.map((gif: gifType) => {
								return (
									<ImageListItem className='media__list-item' sx={{ overflow: "hidden", borderRadius: 1, cursor: "pointer" }} key={gif.id}>
										<img onClick={() => submitGifMessage(gif)} src={gif.media_formats.nanogif.url}/>
										<Box className='media__list-item-buttons' sx={{ position: "absolute", top: 3, right: 3, display: "flex" }}>
											<IconButton onClick={() => deleteSavedGif(gif)} color='error'>
												<CloseIcon/>
											</IconButton>
										</Box>
									</ImageListItem>
								);
							})}
						</ImageList>
					</>
					}
					<Box sx={{ px: 1, my: 1 }}>
						<TextField
							fullWidth
							placeholder='search GIF'
							value={searchGifInputValue}
							onChange={(e) => {
								setSearchGifInputValue(e.target.value);
								debouncedUpdateQuery(e.target.value, 10, updateQueryActionTypes.makeNewQuery);
							}}
						/>
					</Box>
					{gifs &&
					<>

						<ImageList cols={3} gap={6} sx={{ padding: 1, overflowY: "auto" }}>
							{gifs.map((gif) => {
								return (
									<ImageListItem className='media__list-item' sx={{ overflow: "hidden", borderRadius: 1, cursor: "pointer" }} key={gif.id}>
										<img onClick={() => submitGifMessage(gif)}
											 src={gif.media_formats.nanogif.url}
										/>
										<Box className='media__list-item-buttons' sx={{ position: "absolute", top: 3, right: 3, display: "flex" }}>
											<IconButton onClick={() => saveGif(gif)} sx={{ color: "yellow" }}>
												<StarOutlineIcon/>
											</IconButton>
										</Box>
									</ImageListItem>
								);
							})}
						</ImageList>
						<Box>
							<Button fullWidth sx={{ borderRadius: 0 }} variant='contained' onClick={() => {
								setLimitOfGifs(prev => prev + 10);
								debouncedUpdateQuery(searchGifInputValue, limitOfGifs + 10, updateQueryActionTypes.getMoreGifs);
							}}>
								Ещё
							</Button>
						</Box>
					</>
					}
				</>
				}
				{!showGifs &&
				<Picker
					onEmojiClick={onEmojiClick}
					disableAutoFocus={true}
					skinTone={SKIN_TONE_MEDIUM_DARK}
					groupNames={{ smileys_people: "PEOPLE" }}
					native
					pickerStyle={{
						width: "100%",
						height: "100%",
						overflowX: "hidden",
						border: "none",
						background: userStyles.secondBackgroundColor || "#121212",
						color: "white"
					}}
				/>
				}
			</Box>
		</CSSTransition>
	);
});

export default Media;