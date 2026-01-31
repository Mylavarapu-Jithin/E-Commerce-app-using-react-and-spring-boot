import { useForm } from 'react-hook-form';
import InputField from '../../shared/InputField';;
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addCategoryFromDashboard, updateCategoryFromDashboard } from '../../../store/actions';
import ModalButton from '../../shared/ModalButton';

const AddCategoryForm = ({ loader, setLoader, update=false, category, setOpen }) => {

  const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm({mode: "onTouched"}); 
  const dispatch = useDispatch(); 

  const saveCategoryHandler = (data) => {
    if(!update) {
      dispatch(addCategoryFromDashboard(data, setLoader, toast, setOpen, reset));
    } else {
      dispatch(updateCategoryFromDashboard(data, category?.id, setLoader, toast, setOpen, reset)); 
    }
  }; 

  if(update) {
    setValue("categoryName", category?.categoryName);  
  }

  return (
    <div className='relative h-full py-5'>
      <form className='space-y-4' onSubmit={handleSubmit(saveCategoryHandler)}>
        <div className='flex w-full'>
          <InputField label="Category Name" required id="categoryName" type="text" message="this field is required" register={register} errors={errors} placeholder="Enter Category Name" /> 
        </div>

        <ModalButton loader={loader} setOpen={setOpen} update={update} /> 
      </form>
    </div>
  )
}

export default AddCategoryForm