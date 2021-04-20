const AuthenticationForm = ({id='authentication-form', submitButtonTitle='Login', onSubmit}) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = document.getElementById(id);
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