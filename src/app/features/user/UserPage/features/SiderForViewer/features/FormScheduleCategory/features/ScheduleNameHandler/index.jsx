import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Typography, Input} from 'antd';
import {selectScheduleNameFromDA} from '../../../../../../../../../slices/designAutomation/selectors';
import { getScheduleName } from '../../../../../../../../../slices/designAutomation/designAutomationSlice';

const {Text} = Typography;

export default function ScheduleNameHandler() {
  const scheduleNameFromDA = useSelector(selectScheduleNameFromDA);

  const dispatch = useDispatch();

  const handleSetScheduleName = useCallback((event) => {
    dispatch(getScheduleName(event.currentTarget.value))
  }, [])

  return (
    <>
      <Text>Schedule Name</Text>
      <Input
        value={scheduleNameFromDA}
        onChange={handleSetScheduleName}
        placeholder='Schedule Name'
      />
    </>
  );
}
