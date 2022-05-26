import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Typography, Input} from 'antd';
import { setScheduleName, selectScheduleNameFromDA } from '../../../../../../../../../../slices/designAutomation';

const {Text} = Typography;

export default function ScheduleNameHandler() {
  const scheduleNameFromDA = useSelector(selectScheduleNameFromDA);

  const dispatch = useDispatch();

  const handleSetScheduleName = useCallback((event) => {
    dispatch(setScheduleName(event.currentTarget.value));
  }, []);

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
