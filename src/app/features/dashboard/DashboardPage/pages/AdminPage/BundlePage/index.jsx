import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Table, Modal} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import BundleModal from './BundleModal';
import {
  getBundle,
  selectBundle,
  deleteBundle,
  selectLoading,
  deleteLoading,
} from '../../../../../../slices/bundle/bundleSlice';

import {
  BundleModel
} from '../../../../../../slices/bundle/bundleModel';

export default function BundlePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBundle, setEditingBundle] = useState(new BundleModel());

  const bundle = useSelector(selectBundle);
  const dispatch = useDispatch();

  const isDeleting = useSelector(deleteLoading);

  useEffect(() => {
    dispatch(getBundle());
  }, [dispatch]);

  useEffect(() => {
    
  }, [editingBundle]);

  useEffect(() => {
    if (isDeleting) {
      dispatch(getBundle());
    }
  }, [isDeleting]);

  const onAddBundle = () => {
    setIsEditing(true);
    setEditingBundle(new BundleModel());
  };

  const onEditBundle = (record) => {
    setEditingBundle({...record});
    setIsEditing(true);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingBundle(new BundleModel());
  };

  const onDeleteBundle = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this Bundle record?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteBundle(record));
      },
    });
  };

  const columns = [
    {
      key: 'name',
      title: 'name',
      dataIndex: 'name',
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
    <>
      <Button onClick={onAddBundle}>Add a new Bundle</Button>
      <Table columns={columns} dataSource={bundle?.result}></Table>
      <BundleModal
        resetEditing={resetEditing}
        isEditing={isEditing}
        editingBundle={editingBundle}
      />
    </>
  );
}
