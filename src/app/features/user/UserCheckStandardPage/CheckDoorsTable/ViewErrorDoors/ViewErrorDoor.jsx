/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { setWarningDataAtLevel } from '../../../../../slices/forgeStandard/checkDoors';

export default function ViewErrorDoor({warningData}) {
  
  const dispatch = useDispatch();

  const handleShowErrorDataAtLevel = useCallback(() => {
    dispatch(setWarningDataAtLevel(warningData))
  }, [])

  return (
    <div>
    <Button onClick={handleShowErrorDataAtLevel}>show</Button>
    </div>
  )
}
