import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Tree} from 'antd';
import './forgeTree.css';
import {useTreeData} from './useTreeData';
import {selectBucketsFromOSS} from '../../../../../../slices/oss/selectors';
import { useGetOssBucketByIdQuery } from '../../../../../../slices/oss/ossSlice';
import { api } from '../../../../../../../api/axiosClient';

const {TreeNode, DirectoryTree} = Tree;

// eslint-disable-next-line react/prop-types
export default function ForgeTree({setUrn}) {
  // const {treeData} = useTreeData();
const [buckets, setBuckets] = useState([]);
  const dataBucket = useSelector(selectBucketsFromOSS);

  // const dispatch = useDispatch();

  useEffect(() => {
    if (dataBucket){
      const nodes = [];
      dataBucket.map((node) =>
        nodes.push({
          title: node.text,
          key: node.id,
        }),
      );
      setBuckets(nodes);
    }
  }, [dataBucket]);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    const data = {
      "bucketKey": info.node.parent,
      "objectName": info.node.key,
    }
    api.create(`/forge/modelderivative/jobs`, data).then((res) => {
        console.log(res.data.urn);
        setUrn(res.data?.urn)
    });
  };

  //   const onSelect = (selectedKeys, info) => {
  //   console.log(selectedKeys);
  //   console.log(info);
  // };

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return {...node, children};
      }

      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }

      return node;
    });
  }

  const handleOnLoad = ({key, children}) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      api.get(`/forge/oss/buckets/${key}`).then((res) => {
        const arr = [];
        res.data?.result?.map((value) => 
          arr.push({
            key: value.id,
            title: value.text,
            isLeaf: true,
            parent: key
          })
        )
        setBuckets(
          (origin) =>
          updateTreeData(origin, key, arr),
        );
        resolve();
      });
    });

  // processing data
  // const renderTreeNodes = (data) =>
  //   data.map((item) => {
  //     if (item.children) {
  //         return (
  //           <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf}>
  //             {renderTreeNodes(item.children)}
  //           </TreeNode>
  //         );
  //     }
  //     return <TreeNode key={item.key} title={item.title} isLeaf={item.isLeaf} />;
  //   });

  return (
    <div>
      {/* <DirectoryTree onSelect={onSelect} onLoad>
        {renderTreeNodes(buckets)}
      </DirectoryTree> */}
      <Tree treeData={buckets} loadData={handleOnLoad} onSelect={onSelect}/>
    </div>
  );
}
