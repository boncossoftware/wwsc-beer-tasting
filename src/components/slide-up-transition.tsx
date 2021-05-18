import { forwardRef } from "react";
import Slide, { SlideProps } from '@material-ui/core/Slide';

const SlideUpTransition = forwardRef(
    function Transition({...props}: SlideProps, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
export default SlideUpTransition;