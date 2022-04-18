import { useDispatch } from 'react-redux';
import {useCallback, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Icon,
  HStack,
  Text,
} from '@chakra-ui/react';
import {MdComputer} from 'react-icons/md';
import {z} from 'zod';
import {
  designAutomationApi,
  useGetDesignAutomationInfoByIdQuery,
  usePostDesignAutomationGetInfoProjectMutation,
} from '../../../../../../../../slices/designAutomation/designAutomationSlice';

/**
 * //TODO: Implement POST method Data to the Server..
 *
 * Implement a clear file with useState or dispatch state
 * */

const formLabelCSS = {
  cursor: 'pointer',
  width: 'full',
  margin: 0,
  px: '0.75rem',
  height: '2rem',
  minW: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '1.2',
  fontWeight: '300',
  fontSize: '0.875rem',
  borderRadius: '0.1875rem',
  border: '1px solid',
  borderColor: 'gray.300',

  bg: 'transparent',
  _hover: {
    bg: 'gray.50',
  },
  _active: {
    bg: 'gray.100',
  },
};

// HACK: accept fileType here...
const fileTypes = '.rvt, .pdf, .xlsx, .png, .jpeg';
const regex = /\.([^.]?(xlsx|pdf|rvt|png|jpeg))+$/i;
const messageError = `File's extension is not valid`;
const mySchema = z.string().regex(regex, messageError);

// =================================================
// const postFiles = axios.post(
//   POSTDAGETINFOR_URL,
//   data,
//   headers
// )
// =================================================

export default function ButtonUploadFiles() {
  // const [files, setFiles] = useState(null);

  // react hook form
  const {register, handleSubmit} = useForm();
  const dispatch = useDispatch();
  const [id, setId] = useState('');

  const [postDesignAutomationGetInfoProject] = usePostDesignAutomationGetInfoProjectMutation();

  // const postDAGetInfoProject = useSelector(selectAllInfoProject);

  // const handleChange = useCallback(
  //   async (event) => {
  //     try {
  //       const inputFiles = event.currentTarget.files;
  // console.log('event inputFile', inputFiles);

  // setFiles(firstFile);
  // console.log('firstFile', firstFile);

  // const {size, lastModified, type} = firstFile;
  // const date = new Date(lastModified);

  // const dateISO = parseISO(date.toISOString());
  // console.log(dateISO);

  // const timePeriod = formatDistanceToNow(dateISO);
  // console.log(timePeriod);
  // const {name} = firstFile;

  // Guard, using zod schema
  // const filename = mySchema.parse(name);
  // console.log('fileName', filename);
  // } catch (error) {
  // const errorObject = JSON.parse(error.message);
  // console.log(errorObject[0].message)
  // setFiles(null);
  //       console.log(error);
  //     }
  //   },
  //   [],
  // );

  // Check the state of files
  // console.log('stateFiles', files);

  async function onSubmit(formValues) {
    try {
      console.log('form values', formValues);
      const inputFile = formValues.files[0];
      console.log('file', inputFile);

      // ClientId and File most the same as key in the Backend
      const data = new FormData();
      data.append('ClientId', 'abc123123321');
      data.append('File', inputFile);

      await postDesignAutomationGetInfoProject(data).unwrap().then(res => setId(res.result.id));

      // await addOssBucket(data).unwrap();
    } catch (error) {
      console.log(error);
    }
  }
  const handleCallApi = useCallback(() => {
    console.log(id);
    const res = dispatch(designAutomationApi.endpoints.getDesignAutomationInfoById.initiate(id));
    console.log(res);
  }, []);

  return (
    <HStack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor='uploadFile' sx={formLabelCSS}>
            <Icon as={MdComputer} boxSize='20px' mr={2} />
            <Text as='span'>From your computer</Text>
          </FormLabel>
          <Input
            id='uploadFile'
            accept={fileTypes}
            type='file'
            {...register('files')}
            hidden
          />
        </FormControl>
        <Button type='submit'>Submit</Button>
        <Button type='button' onClick={handleCallApi}>
          Call api
        </Button>
      </form>
    </HStack>
  );
}
