import React, { useState } from 'react';
import ArrowCircleUpSharpIcon from '@mui/icons-material/ArrowCircleUpSharp';
import { Button } from './style';

const ScrollButton = () => {

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    };

    const scrollToTop = () => {
        console.log('hahahaahahahas')
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
                in place of 'smooth' */
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <Button>
            <ArrowCircleUpSharpIcon onClick={scrollToTop}
                style={{ color: 'black', borderRadius: '50px', backgroundColor: 'white', width: '50px', height: '50px', display: visible ? 'inline' : 'none' }} />
        </Button>
    );
}

export default ScrollButton