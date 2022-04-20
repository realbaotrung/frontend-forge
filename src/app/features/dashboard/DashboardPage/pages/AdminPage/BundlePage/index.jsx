import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Table, Modal, Spin, notification } from 'antd';
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
import Notification from '../../../../../../components/Notification';

export default function BundlePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBundle, setEditingBundle] = useState(new BundleModel());
  const bundle = useSelector(selectBundle);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectSuccess)

  useEffect(() => {
    dispatch(getBundle({index: SystemContants.PAGE_INDEX, size: SystemContants.PAGE_SIZE}));
  }, [dispatch]);

  const onAddBundle = () => {
    setIsEditing(true);
    setEditingBundle(new BundleModel());
  };

  const onEditBundle = (record) => {
    setEditingBundle({...record, bundleCategoryId: record.bundleCategory.id});
    setIsEditing(true);
  };

  const resetEditing = (isReset = false) => {
    setIsEditing(false);
    setEditingBundle(new BundleModel());
    if(isReset) {
      dispatch(getBundle({index: currentPage, size: SystemContants.PAGE_SIZE}));
    }
  };

  const closeModal = () => {

  };

  const openNotification = () => {
    notification.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  useEffect(() => {
    if(isSuccess) {
      dispatch(getBundle({index: SystemContants.PAGE_INDEX, size: SystemContants.PAGE_SIZE}));
      Notification('sssss', 'ssssssssss', 'info')
      // openNotification();
    }
  }, [isSuccess])

  useEffect(() => {

  }, [editingBundle])

  const paginationChange =(page, pageSize) =>{
    setCurrentPage(page);
    dispatch(getBundle({index: page, size: pageSize}));
  }
  const onDeleteBundle = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this Bundle record?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteBundle(record));
        // dispatch(getBundle({index: SystemContants.PAGE_INDEX, size: SystemContants.PAGE_SIZE}));
        // openNotification();
      },
    });
  };

  const columns = [
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'path',
      title: 'path',
      dataIndex: 'path',
    },
    {
      key: 'bundleCategory',
      title: 'bundleCategory',
      render: (record) => {
        return <p>{record?.name}</p>;
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
      })} pagination={{pageSize: SystemContants.PAGE_SIZE, total:bundle?.totalRecords,  defaultCurrent: 1, onChange: paginationChange}}  ></Table>
      <BundleModal
        resetEditing={resetEditing}
        isEditing={isEditing}
        editingBundle={editingBundle}
        closeModal={closeModal}
      />
      </Spin>
  );
}
