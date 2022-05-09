import {Breadcrumb} from 'antd';
import {useSelector} from 'react-redux';
import {
  selectFileNameFromMD,
} from '../../../../../slices/modelDerivative/selectors';
import {
  selectCurrentViewNameFromFV,
  selectDidChosenViewToShowBreadcrumbFromFV,
} from '../../../../../slices/forgeViewer/selectors';

const {Item} = Breadcrumb;

export default function NameOfFileWithView() {
  /**
   * using breadcrumb to show file name with current view
   */

  const fileNameFromMD = useSelector(selectFileNameFromMD);
  const currentViewNameFromFV = useSelector(selectCurrentViewNameFromFV);

  const didChosenViewToShowBreadcrumb = useSelector(
    selectDidChosenViewToShowBreadcrumbFromFV,
  );

  return (
    <div
      className='center-content'
      style={{height: '48px', backgroundColor: '#fff'}}
    >
      {!didChosenViewToShowBreadcrumb && fileNameFromMD && (
        <span
          style={{
            fontSize: '1.1em',
            border: '1px solid red',
            padding: '0.5rem',
          }}
        >
          {fileNameFromMD}
        </span>
      )}
      {didChosenViewToShowBreadcrumb && currentViewNameFromFV && (
        <Breadcrumb>
          <Item>
            <span
              style={{
                fontSize: '1.1em',
                border: '1px solid red',
                padding: '0.5rem',
              }}
            >
              {fileNameFromMD}
            </span>
          </Item>
          <Item>
            <span
              style={{
                fontSize: '1.1em',
                border: '1px solid #0052CC',
                padding: '0.5rem',
              }}
            >
              {currentViewNameFromFV}
            </span>
          </Item>
        </Breadcrumb>
      )}
    </div>
  );
}
