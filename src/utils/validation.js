import { toast } from "react-toastify";

export const passwordValidator = (pass_word) => {
    let passwordCheck = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)
    if (!passwordCheck.test(pass_word)) {
        toast.info("Password contain 8 to 16 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special symbol.")
        return false;
    }
    return true;
}