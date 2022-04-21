import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Table, Modal, Spin } from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import BundleModal from './BundleModal';
import { SystemContants } from '../../../../../../../common/systemcontants';
import {
  getBundle,
  selectBundle,
  deleteBundle,
  selectLoading,
  selectSuccess
} from '../../../../../../slices/bundle/bundleSlice';

import {
  BundleModel
} from '../../../../../../slices/bundle/bundleModel';

export default function BundlePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusModal, setstatusModal] = useState(0);
  const [editingBundle, setEditingBundle] = useState(new BundleModel());
  const bundle = useSelector(selectBundle);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectSuccess);


  useEffect(() => {
    dispatch(getBundle({index: SystemContants.PAGE_INDEX, size: SystemContants.PAGE_SIZE}));
    console.log(bundle)
  }, [dispatch]);

  const onAddBundle = () => {
    setstatusModal(0);
    setIsEditing(true);
    setEditingBundle(new BundleModel());
  };

  const resetEditing = (isReset = false) => {
    setIsEditing(false);
    setEditingBundle(new BundleModel());
    if(isReset) {
      dispatch(getBundle({index: currentPage, size: SystemContants.PAGE_SIZE}));
    }
  };

  useEffect(() => {
    if(isSuccess) {
      if(isEditing && statusModal === 1) {
        setCurrentPage(currentPage)
      } else {
        setCurrentPage(1)
      }
      dispatch(getBundle({index: currentPage, size: SystemContants.PAGE_SIZE}));
    }
  }, [isSuccess])

  useEffect(() => {
  }, [editingBundle])

  const onEditBundle = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingBundle({...record, bundleCategoryId: record.bundleCategory.id});
  };

  const onDeleteBundle = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this Bundle record?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteBundle(record));
        setCurrentPage(1);
      },
    });
  };

  const paginationChange =(page, pageSize) =>{
    setCurrentPage(page);
    dispatch(getBundle({index: page, size: pageSize}));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'bundleCategory',
      title: 'BundleCategory',
      render: (record) => {
        return <p>{record?.bundleCategory.name}</p>;
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditBundle(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteBundle(record);
              }}
              style={{color: 'red', marginLeft: 12}}
            />
          </>
        );
      },
    },
  ];
  return (
    <Spin spinning={isLoading}>
      <Button onClick={onAddBundle}>Add a new Bundle</Button>
      <Table columns={columns} dataSource={bundle?.result.map((value) => {
        return {...value, key:value.id}
      })} pagination={{pageSize: SystemContants.PAGE_SIZE, total:bundle?.totalRecords, onChange: paginationChange, current:currentPage}}  ></Table>
      <BundleModal
        resetEditing={resetEditing}
        isEditing={isEditing}
        editingBundle={editingBundle}
      />
      </Spin>
  );
}
