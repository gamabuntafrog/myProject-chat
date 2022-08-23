import React, {useState, useEffect, FC, SetStateAction, Dispatch, Ref, useRef, memo} from "react"
import {Box, Button, ImageList, ImageListItem, TextField} from "@mui/material";
import Picker, {SKIN_TONE_MEDIUM_DARK} from "emoji-picker-react";
import {screenTypes, useGetTypeOfScreen} from "../../hooks/useGetTypeOfScreen";
import {emojiType, gifType, updateQueryActionTypes} from "../Chat/Chat";
import {userStylesType} from "../../App";
import CloseIcon from '@mui/icons-material/Close';
import {CSSTransition} from 'react-transition-group'
import './Media.css'

type MediaPT = {
    showGifs: boolean,
    setShowGifs: Dispatch<SetStateAction<boolean>>,
    searchGifInputValue: string,
    setSearchGifInputValue: Dispatch<SetStateAction<string>>,
    setLimitOfGifs: Dispatch<SetStateAction<number>>,
    debouncedUpdateQuery: any,
    gifs: gifType[] | null,
    onEmojiClick: (_: any, emojiObject: emojiType) => void,
    userStyles: userStylesType,
    limitOfGifs: number,
    submitGifMessage: (gif: gifType) => void,
    setShowMedia: Dispatch<SetStateAction<boolean>>,
    showMedia: boolean
}

const Media: FC<MediaPT> = memo(({
                        showGifs,
                        setShowGifs,
                        searchGifInputValue,
                        setSearchGifInputValue,
                        setLimitOfGifs,
                        debouncedUpdateQuery,
                        gifs,
                        onEmojiClick,
                        userStyles,
                        limitOfGifs,
                        submitGifMessage,
                        setShowMedia,
                        showMedia
                   }) => {

    const {isMobile, isTablet} = useGetTypeOfScreen()

    const sectionRef: Ref<HTMLElement | undefined> | null = useRef(null);


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
                    height: '70%',
                    width: '100%',
                    background: userStyles.secondBackgroundColor,
                    borderLeft: '1px solid #363636',
                    // height: 'auto',
                    overflowY: 'auto',
                    position: 'fixed',
                    bottom: 0,
                    zIndex: 100,

                } :
                {
                    width: isTablet ? '35%' : '20%',
                    minWidth: isTablet ? '35%' : '20%',
                    height: 'auto',
                    overflowY: 'auto',
                    borderLeft: '1px solid #363636',
                }
            }>
                <Box sx={{display: 'flex', justifyContent: 'space-evenly', position: 'sticky', top: 0, zIndex: 100, background: userStyles.secondBackgroundColor, py: 1}}>
                    <Button sx={{width: '50%', borderRadius: 0}} variant={!showGifs ? 'contained' : 'text'}
                            onClick={() => setShowGifs(false)}>EMOJI</Button>
                    <Button sx={{width: '50%', borderRadius: 0}} variant={showGifs ? 'contained' : 'text'}
                            onClick={() => setShowGifs(true)}>GIF</Button>
                    <Button onClick={() => setShowMedia(false)} sx={{borderRadius: 0}} color='error'>
                        <CloseIcon/>
                    </Button>
                </Box>
                {showGifs && gifs &&
				        <>
					        <Box sx={{px: 1, my: 1}}>
						        <TextField
							        fullWidth
							        placeholder='search GIF'
							        value={searchGifInputValue}
							        onChange={(e) => {
                                      setSearchGifInputValue(e.target.value)
                                      debouncedUpdateQuery(e.target.value, 10, updateQueryActionTypes.makeNewQuery)
                                  }}
						        />
					        </Box>
					        <ImageList cols={2} gap={6} sx={{padding: 1, overflowY: 'auto'}}>
                              {gifs.map((gif) => {
                                  return (
                                      <ImageListItem onClick={() => {
                                          submitGifMessage(gif)
                                      }} sx={{overflow: 'hidden', borderRadius: 1, cursor: 'pointer'}} key={gif.id}>
                                          <img src={gif.media_formats.nanogif.url}/>
                                      </ImageListItem>
                                  )
                              })}
					        </ImageList>
					        <Box>
						        <Button fullWidth sx={{borderRadius: 0}} variant='contained' onClick={() => {
                                    setLimitOfGifs(prev => prev + 10)
                                    debouncedUpdateQuery(searchGifInputValue, limitOfGifs + 10, updateQueryActionTypes.getMoreGifs)
                                }}>
							        Ещё
						        </Button>
					        </Box>
				        </>
                }
                {!showGifs &&
				        <Picker
					        onEmojiClick={onEmojiClick}
					        disableAutoFocus={true}
					        skinTone={SKIN_TONE_MEDIUM_DARK}
					        groupNames={{smileys_people: 'PEOPLE'}}
					        native
					        pickerStyle={{
                              width: '100%',
                              height: '100%',
                              overflowX: 'hidden',
                              border: 'none',
                              background: userStyles.secondBackgroundColor || '#121212',
                              color: 'white',
                          }}
				        />
                }
            </Box>
        </CSSTransition>
    )
})

export default Media