import { Button } from '@mui/material'
import Spinners from './Spinners'

const ModalButton = ({ loader, setOpen, update = false, }) => {
  return (
    <div className='flex w-full justify-between items-center absolute bottom-14'>
      <Button disabled={loader} onClick={() => setOpen(false)} variant="outlined">
        Cancel
      </Button> 

      <Button disabled={loader} type='submit' variant='contained'>  
        {loader ? (
          <div className='flex gap-2 items-center'> 
            <Spinners /> Loading... 
          </div>
        ) : update ? "Update" : "Save"
        } 
      </Button> 
    </div>
  )
}

export default ModalButton