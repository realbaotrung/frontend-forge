import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BundleModal from './BundleModal';
import {getBundle, selectBundle, deleteBundle, selectLoading, deleteLoading} from '../../../../../../slices/bundle/bundleSlice';


export default function BundlePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const bundle = useSelector(selectBundle);
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const isDeleting = useSelector(deleteLoading);

  useEffect(() => {
    dispatch(getBundle());
  }, [dispatch])
  
  useEffect(() => {
    if(isDeleting) {
      dispatch(getBundle());
    }
  }, [isDeleting])

  const onAddStudent = () => {
    setIsEditing(true);
    setEditingStudent(null);
  };

  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStudent({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };

  const closeModal = (isLoad) => {
    setIsEditing(false);
    if(isLoad) {
      dispatch(getBundle());
    }
      
  };

  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this student record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        dispatch(deleteBundle(record));
      },
    });
  };

  const columns = [
    {
      key: "name",
      title: "name",
      dataIndex: "name",
    },
    {
      key: "path",
      title: "path",
      dataIndex: "path",
    },
    {
      key: "bundleCategory",
      title: "bundleCategory",
      render: (record) => {
        return (
            <p>
            {record?.name}
            </p>
        );
      }
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  return (
    <>
        <Button onClick={onAddStudent}>Add a new Student</Button>
        <Table columns={columns} dataSource={bundle?.result}></Table>
        <BundleModal resetEditing={resetEditing} isEditing={isEditing} editingStudent={editingStudent} closeModal={closeModal}/>
      </>
  );  
}
