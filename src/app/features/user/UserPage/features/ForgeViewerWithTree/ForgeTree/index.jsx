import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Tree} from 'antd';
import {selectBucketsFromOSS} from '../../../../../../slices/oss/selectors';
import {api} from '../../../../../../../api/axiosClient';
import {usePostModelDerivativeJobsMutation} from '../../../../../../slices/modelDerivative/modelDerivativeSlice';
import './forgeTree.css';

const {DirectoryTree} = Tree;

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

// eslint-disable-next-line react/prop-types
export default function ForgeTree() {
  const [buckets, setBuckets] = useState([]);
  const dataBucket = useSelector(selectBucketsFromOSS);

  const [postModelDerivativeJobs] = usePostModelDerivativeJobsMutation();

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

  const onSelect = useCallback(async (selectedKeys, info) => {
    try {
      console.log('selected', selectedKeys, info);
      const isLeaf = info?.node?.isLeaf;
      if (isLeaf) {
        const data = {
          bucketKey: info.node.parent,
          objectName: info.node.key,
        };
        await postModelDerivativeJobs(data).unwrap();
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
      onSelect={onSelect}
      style={{
        overflow: 'auto',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    />
  );
}
