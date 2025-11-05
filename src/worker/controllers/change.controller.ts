import { TabChangeCallback } from "../../callbacks/change.callbacks";
import ChangeService from "../services/change.service";


export default class ChangeController{
    changeService!:ChangeService;
    public constructor(changeService:ChangeService){
        this.changeService=changeService;
    }

    public onTabChange(callback:TabChangeCallback){
        this.changeService.registerTab(callback);
    }



}