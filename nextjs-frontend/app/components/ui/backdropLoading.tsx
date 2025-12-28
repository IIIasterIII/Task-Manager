import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function BackdropLoading({open} : {open: boolean}) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}