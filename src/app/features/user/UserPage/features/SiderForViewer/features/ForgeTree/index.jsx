import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Tree} from 'antd';
import {selectBucketsFromOSS} from '../../../../../../../slices/oss';
import {api} from '../../../../../../../../api/axiosClient';
import {
  setFileName,
  setIsChosenFile,
  usePostModelDerivativeJobsMutation,
} from '../../../../../../../slices/modelDerivative';
import {setTokenOAuth2Legged} from '../../../../../../../slices/oAuth';
import {
  resetAllFromForgeViewerSlice,
  setCurrentViewName,
  setDidChosenViewToShowBreadcrumb,
} from '../../../../../../../slices/forgeViewer';

function updateTreeData(list, key, children) {
  return list.map((node) => {
    if (node.key === key) {
      return {...node, children};
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

export default function ForgeTree() {
  const [buckets, setBuckets] = useState([]);
  const dataBucket = useSelector(selectBucketsFromOSS);

  const [postModelDerivativeJobs] = usePostModelDerivativeJobsMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (dataBucket) {
      const nodes = [];
      dataBucket.map((node) =>
        nodes.push({
          key: node.id,
          title: node.text,
        }),
      );
      setBuckets(nodes);
    }
  }, [dataBucket]);

  const handleOnSelect = useCallback(async (selectedKeys, info) => {
    try {
      dispatch(resetAllFromForgeViewerSlice());
      console.log('selected', selectedKeys, info);

      const fileName = info?.node?.title;
      dispatch(setFileName(fileName));
      dispatch(setIsChosenFile(true));
      dispatch(setCurrentViewName(''));
      dispatch(setDidChosenViewToShowBreadcrumb(false));

      const isLeaf = info?.node?.isLeaf;
      if (isLeaf) {
        const data = {
          bucketKey: info.node.parent,
          objectName: info.node.key,
        };
        await postModelDerivativeJobs(data).unwrap();

        // Get new 2 legged token each post request
        const resToken2Legged = await api.get('forge/oauth/token-2-legged');
        dispatch(setTokenOAuth2Legged(resToken2Legged.data?.access_token));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleOnLoad = useCallback(async ({key, children}) => {
    try {
      if (children) return;
      const arr = [];
      const res = await api.get(`/forge/oss/buckets/${key}`);
      res.data?.result?.map((value) =>
        arr.push({
          key: value.id,
          title: value.text,
          isLeaf: true,
          parent: key,
        }),
      );
      setBuckets((origin) => updateTreeData(origin, key, arr));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Tree
      showLine
      treeData={buckets}
      loadData={handleOnLoad}
      onSelect={handleOnSelect}
      style={{
        overflow: 'auto',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        height: '700px',
        paddingLeft: '1.5rem',
        paddingBottom: '2rem',
      }}
    />
  );
}

/*
eslint
  react/prop-types: 0,
*/
