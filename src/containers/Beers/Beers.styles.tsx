import {
    Container as BaseContainer,
    styled
} from '@material-ui/core';
import FullPageCircularProgress from "@/components/full-page-circular-progress";
import BaseSection from '@/components/section-grid';

export const CircularProgress = FullPageCircularProgress;
export const Section = BaseSection;
export const Container = styled(({ ...p }) =>
    <BaseContainer {...p} />
)(({ theme }) => ({
    paddingBottom: theme.spacing(4),
}));