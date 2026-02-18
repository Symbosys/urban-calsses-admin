import { AxiosError } from "axios";
import {toast} from "sonner";

export const showErrorMessage = (error: AxiosError | Error) => {
    if(error instanceof AxiosError){
        toast.error(error.response?.data.message);
    }else{
        toast.error(error.message);
    }
}

export const showSuccessMessage = (message: string) => {
    toast.success(message);
}

export const showWarningMessage = (message: string) => {
    toast.warning(message);
}

export const showInfoMessage = (message: string) => {
    toast.info(message);
}