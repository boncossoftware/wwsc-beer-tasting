import { MouseEventHandler } from "react";

type AuthenticationFormOnSubmitCallback = (
    email:FormDataEntryValue|null, 
    password: FormDataEntryValue|null
) => void;

interface AuthenticationFormProps {
    id?: string,
    submitButtonTitle?: string,
    onSubmit?: AuthenticationFormOnSubmitCallback
}
const AuthenticationForm = (
    {
        id='authentication-form', 
        submitButtonTitle='Login', 
        onSubmit
    }: AuthenticationFormProps
) => {
    const handleSubmit: MouseEventHandler = (event) => {
        event.preventDefault();

        const form = document.getElementById(id) as HTMLFormElement;
        if (!form) return;

        const data = new FormData(form);
        const emailValue = data.get('email');
        const passwordValue = data.get('password');
        
        (onSubmit && onSubmit(emailValue, passwordValue));
    }
    return (
        <form id={id}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email"/>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            <input type="submit" value={submitButtonTitle} onClick={handleSubmit} />
        </form>
    );
}
export default AuthenticationForm;