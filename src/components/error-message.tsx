import { Alert } from "@material-ui/lab";
import { styled } from "@material-ui/core";

const ErrorMessage = styled(({ children, error, ...p }) => {
  const errorMessage = `${error?.message}(${error?.code})`;
  return (
    <Alert elevation={6} variant="filled" severity="error" {...p}>
    {errorMessage}
    {children}
    </Alert>
  );
})(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: "100%",
  wordWrap: 'break-word',
  '& .MuiAlert-message': {
    wordBreak: 'break-word'
  }
}));

export default ErrorMessage;
