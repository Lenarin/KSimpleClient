import {action, observable} from "mobx";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";
import {SvgIconTypeMap} from "@material-ui/core";

export interface NavIconButtonProps {
    onClick: (props: any) => any;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
}

export interface NavTextButtonProps {
    onClick: (props: any) => any;
    text: string
}

class NavigationStore {
    @observable currentPageName: string = '';
    @observable buttons: (NavIconButtonProps | NavTextButtonProps)[] = [];
    
    @action setCurrentPageName(pageName: string) {
        this.currentPageName = pageName;
    }
    
    @action setButtons(buttons: (NavIconButtonProps | NavTextButtonProps)[]) {
        this.buttons = buttons;
    }
}

export default new NavigationStore();