import React, { useState, useEffect } from 'react';

const getScreenCategory = (width) => {
    if (width >= 1200) return 'wide';
    if (width >= 768) return 'normal';
    if (width >= 480) return 'narrow';
    return 'mobile';
};

export const useScreenCategory = () => {
    const [screenCategory, setScreenCategory] = useState(getScreenCategory(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setScreenCategory(getScreenCategory(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return screenCategory;
};

//export default useScreenCategory;
