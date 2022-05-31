import {Checkbox} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCheckboxSheet} from '../../../../../../../../../slices/designAutomation/designAutomationSlice';
import {selectIsSheetFromDA} from '../../../../../../../../../slices/designAutomation/selectors';

export default function SheetNameHandler() {
  const [checked, setChecked] = useState(false);
  const isCheckedSheet = useSelector(selectIsSheetFromDA);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isCheckedSheet) {
      setChecked(false);
    }
  }, [isCheckedSheet]);

  const handleOnCheckbox = useCallback((event) => {
    const isChecked = event.currentTarget.checked;
    setChecked(true);
    dispatch(getCheckboxSheet(isChecked));
  }, []);

  return (
    <Checkbox
      style={{lineHeight: '32px'}}
      onClick={handleOnCheckbox}
      checked={checked}
    >
      Create Sheet
    </Checkbox>
  );
}
