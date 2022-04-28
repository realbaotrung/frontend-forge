import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Tree} from 'antd';
import {selectView3DsFromFV, selectIsFirstTimeLoadViewerFromFV, selectGuid2dViewFromFV} from '../../../../../../slices/forgeViewer/selectors';
import {setGuid3dView, setIsFirstTimeLoadViewer, setHaveSelectedView, setGuid2dView} from '../../../../../../slices/forgeViewer/forgeViewerSlice';

export default function Forge3DList() {
  const [toggle, setToggle] = useState(false)
  const [listView3D, setListView3D] = useState([]);

  const view3Ds = useSelector(selectView3DsFromFV);
  const guid2d = useSelector(selectGuid2dViewFromFV);
  const isFirstTimeLoadViewer = useSelector(selectIsFirstTimeLoadViewerFromFV);

  const dispatch = useDispatch();

  useEffect(() => {
    if (view3Ds) {
      setListView3D(view3Ds);
    }
  }, [view3Ds]);

  const data = useMemo(() => {
    const result = [];
    if (!listView3D) {
      return result;
    }
    listView3D.map((view) =>
      result.push({
        key: view.guid,
        title: view.name,
        isLeaf: true,
      }),
    );

    return result;
  }, [listView3D]);

  const onSelect = (_, info) => {
    if (isFirstTimeLoadViewer) {
      dispatch(setIsFirstTimeLoadViewer(false));
    }
    if (guid2d) {
      dispatch(setGuid2dView(''))
    }
    setToggle(prev => !prev)
    dispatch(setGuid3dView(info?.node?.key));
    dispatch(setHaveSelectedView(toggle));
  };

  return (
    <Tree
      onSelect={onSelect}
      treeData={data}
      style={{
        overflow: 'auto',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxHeight: '140px',
      }}
    />
  );
}
