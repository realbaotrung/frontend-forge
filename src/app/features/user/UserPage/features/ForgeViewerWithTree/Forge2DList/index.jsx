import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Tree} from 'antd';
import {selectGuid3dViewFromFV, selectIsFirstTimeLoadViewerFromFV, selectView2DsFromFV} from '../../../../../../slices/forgeViewer/selectors';
import {setGuid2dView, setIsFirstTimeLoadViewer, setHaveSelectedView, setGuid3dView} from '../../../../../../slices/forgeViewer/forgeViewerSlice';

export default function Forge2DList() {
  const [toggle, setToggle] = useState(false)
  const [listView2D, setListView2D] = useState([]);

  const view2Ds = useSelector(selectView2DsFromFV);
  const guid3d = useSelector(selectGuid3dViewFromFV);
  const isFirstTimeLoadViewer = useSelector(selectIsFirstTimeLoadViewerFromFV);

  const dispatch = useDispatch();

  useEffect(() => {
    if (view2Ds) {
      setListView2D(view2Ds);
    }
  }, [view2Ds]);

  const data = useMemo(() => {
    const result = [];
    if (!listView2D) {
      return result;
    }
    listView2D.map((view) =>
      result.push({
        key: view.guid,
        title: view.name,
        isLeaf: true,
      }),
    );

    return result;
  }, [listView2D]);

  const onSelect = (_, info) => {
    if (isFirstTimeLoadViewer) {
      dispatch(setIsFirstTimeLoadViewer(false));
    }
    if (guid3d) {
      dispatch(setGuid3dView(''))
    }
    setToggle(prev => !prev)
    dispatch(setGuid2dView(info?.node?.key));
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
      }}
    />
  );
}
