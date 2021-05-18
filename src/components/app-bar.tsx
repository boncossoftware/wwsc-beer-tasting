import { Toolbar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { auth } from "store";
import AccountButton from "./account-button";
import { 
    AppBar as BaseAppBar,
    AppBarTitle
} from "./app-bar.styles";

export type AppBarProps ={
    title: string|undefined;
    renderLeftComponent?: () => JSX.Element | null | undefined;
    renderRightComponent?: () => JSX.Element | null | undefined;
}

const AppBar = ({title, 
    renderLeftComponent, 
    renderRightComponent = () => null
}:AppBarProps) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch( auth.logout() );
    }
    
    return (
        <BaseAppBar>
            <Toolbar>
                {renderLeftComponent ? 
                    renderLeftComponent() 
                    : 
                    <AccountButton onClickLogout={handleLogout} />
                }
                <AppBarTitle>{title}</AppBarTitle>
                {renderRightComponent()}    
            </Toolbar>
        </BaseAppBar>
    );
}
export default AppBar;