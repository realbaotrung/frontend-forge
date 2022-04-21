import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {Button, Table, Modal, Spin} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  deleteBundleCategory,
  getBundleCategory, selectBundleCategory, selectLoading
} from "../../../../../../slices/bundleCategory/bundleCategorySlice";
import BundleCategoryModal from "./BundleCategoryModal";
import {SystemContants} from "../../../../../../../common/systemcontants";


export default function CategoriesPage() {

  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const bundleCategories = useSelector(selectBundleCategory);

  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  // const isDeleting = useSelector(deleteLoading);

  const paginationChange =(page, pageSize) =>{
    setCurrentPage(page);
    dispatch(getBundleCategory({index: page, size: pageSize}));
  }

  useEffect(() => {
    dispatch(getBundleCategory());
  }, [dispatch])

  const onAddCategory = () => {
    setIsEditing(true);
    setEditingCategory({});
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingCategory(null);
  };

  const closeModal = (isLoad) => {
    setIsEditing(false);
    if(isLoad) {
      dispatch(getBundleCategory());
    }
  };
  const onEditCategory = (record) => {
    setIsEditing(true);
    setEditingCategory({ ...record });
  };
  const onDeleteCategory = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this category record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        dispatch(deleteBundleCategory(record))
      },
    });
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "Type",
      title: "Type",
      dataIndex: "typeName",
    },
    {
      key: "actions",
      title: "Actions",
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
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  return (
    <Spin spinning={isLoading}>
      <Button onClick={onAddCategory}>Add a new Category</Button>
      <Table columns={columns} dataSource={
        bundleCategories?.result?.map((value) => {
          let name = "Base";
          if(value.type !== 1){
            name = "Function"
          }
        return {...value, typeName: name, key:value.id}
        })} pagination={{pageSize: SystemContants.PAGE_SIZE, total:bundleCategories?.totalRecords,  defaultCurrent: 1, onChange: paginationChange}}  ></Table>
      <BundleCategoryModal resetEditing={resetEditing} isEditing={isEditing} editingCategory={editingCategory} closeModal={closeModal}/>
    </Spin>
  );  
}
