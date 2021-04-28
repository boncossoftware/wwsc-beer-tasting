import { 
    styled, 
    Theme, 
    Typography 
} from "@material-ui/core";

const getImageHeight = (theme: Theme) => {
    if (typeof theme.typography.caption.fontSize === 'string') {
        let captionFontSizeRem: number = 1;
        const conversion = theme.typography.fontSize;
        const size = theme.typography.caption.fontSize as string;
        if (size.endsWith('rem')) {
            captionFontSizeRem = parseFloat(size.slice(0, size.length-3));
        }
        return conversion * captionFontSizeRem;
    }
    throw new Error('Unsupported caption font size type for getImageHeight!');
}

export const Text = styled(p=>
    <Typography variant="caption" {...p}/>
)(({theme}) => ({
    background: theme.palette.background.default,
    '& a': {
        '& img': {
            marginBottom: -1,
            height: getImageHeight(theme)
        }
    }
}));