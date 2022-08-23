import {useEffect, useState} from "react";

export enum screenTypes {
    largeType,
    mediumType,
    smallType
}

export const useGetTypeOfScreen = () => {
    const [screenType, setScreenType] = useState<screenTypes>(screenTypes.mediumType);

    useEffect(() => {
        const handleWidth = () => {
            if (window.innerWidth > 1280) {
                setScreenType(screenTypes.largeType)
            } else if (window.innerWidth > 768 && window.innerWidth < 1280) {
                setScreenType(screenTypes.mediumType)
            } else if (window.innerWidth < 768) {
                setScreenType(screenTypes.smallType)
            }
        }
        handleWidth()
        window.addEventListener('resize', handleWidth)

        return () => {
            window.removeEventListener('resize', handleWidth)
        }
    }, []);

    const isMobile = screenType === screenTypes.smallType;
    const isTablet = screenType === screenTypes.mediumType;
    const isMobileOrTablet = (screenType === screenTypes.smallType || screenType === screenTypes.mediumType);
    const isDesktop = screenType === screenTypes.largeType;

    return {screenType, isMobile, isTablet, isMobileOrTablet, isDesktop}
}

