import { MouseEventHandler } from "react";
import {
    Container,
    EmailField,
    PasswordField,
    SubmitButton
} from './authentication-form.styles';

export type AuthenticationFormOnSubmitCallback = (
    email:FormDataEntryValue|null, 
    password: FormDataEntryValue|null
) => void;

export interface AuthenticationFormProps {
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
        <Container id={id}>
            <EmailField />
            <PasswordField />
            <SubmitButton
                onClick={handleSubmit}
            >
                {submitButtonTitle}
            </SubmitButton>
        </Container>
    );
}
export default AuthenticationForm;