/* eslint-disable react/prop-types */
import { Button } from 'antd';
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsShowDbIdErrorDoors, setWarningDataAtLevel } from '../../../../../slices/forgeStandard/checkDoors';

export default function ViewErrorDoor({warningData}) {

  const databaseId = [
    3064, 3063, 3096, 3095, 3106, 3105, 3140, 3139, 3158, 3157, 3168, 3167,
  ];

  const dispatch = useDispatch();
  
  const handleShowErrorDataAtLevel = useCallback(() => {
    dispatch(setWarningDataAtLevel(warningData))
    dispatch(setIsShowDbIdErrorDoors(true))
  }, [])

  return (
    <div>
    <Button onClick={handleShowErrorDataAtLevel}>show</Button>
    </div>
  )
}
