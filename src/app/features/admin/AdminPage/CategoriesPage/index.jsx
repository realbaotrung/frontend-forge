import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Table, Modal, Spin} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {
  deleteBundleCategory,
  getBundleCategory,
  selectBundleCategory,
  selectLoading,
  selectSuccess,
} from '../../../../slices/bundleCategory/bundleCategorySlice';
import BundleCategoryModal from './BundleCategoryModal';
import {SystemContants} from '../../../../../common/systemcontants';

export default function CategoriesPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusModal, setstatusModal] = useState(0);
  const bundleCategories = useSelector(selectBundleCategory);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectSuccess);

  useEffect(() => {
    dispatch(
      getBundleCategory({
        index: SystemContants.PAGE_INDEX,
        size: SystemContants.PAGE_SIZE,
      }),
    );
  }, [dispatch]);

  const onAddCategory = () => {
    setstatusModal(0);
    setIsEditing(true);
    setEditingCategory({});
  };

  const resetEditing = (isReset = false) => {
    setIsEditing(false);
    setEditingCategory(null);
    if (isReset) {
      dispatch(
        getBundleCategory({index: currentPage, size: SystemContants.PAGE_SIZE}),
      );
    }
  };

  const paginationChange = (page, pageSize) => {
    setCurrentPage(page);
    dispatch(getBundleCategory({index: page, size: pageSize}));
  };

  useEffect(() => {
    if (isSuccess) {
      if (isEditing && statusModal === 1) {
        setCurrentPage(currentPage);
      } else {
        setCurrentPage(1);
      }
      dispatch(
        getBundleCategory({index: currentPage, size: SystemContants.PAGE_SIZE}),
      );
    }
  }, [isSuccess]);

  useEffect(() => {}, [editingCategory]);

  const onEditCategory = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingCategory({...record});
  };

  const onDeleteCategory = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this category record?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteBundleCategory(record));
        setCurrentPage(1);
      },
    });
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'Type',
      title: 'Type',
      dataIndex: 'typeName',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditCategory(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteCategory(record);
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
      <Button onClick={onAddCategory}>Add a new Category</Button>
      <Table
        columns={columns}
        dataSource={bundleCategories?.result?.map((value) => {
          let name = 'Base';
          if (value.type !== 1) {
            name = 'Function';
          }
          return {...value, typeName: name, key: value.id};
        })}
        pagination={{
          pageSize: SystemContants.PAGE_SIZE,
          total: bundleCategories?.totalRecords,
          onChange: paginationChange,
          current: currentPage,
        }}
      ></Table>
      <BundleCategoryModal
        resetEditing={resetEditing}
        isEditing={isEditing}
        editingCategory={editingCategory}
      />
    </Spin>
  );
}
