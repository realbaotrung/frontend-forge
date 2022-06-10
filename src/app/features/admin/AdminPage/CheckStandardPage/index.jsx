import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Table, Modal, Spin, Switch} from 'antd';
import axios from 'axios';
import {EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import {SystemContants} from '../../../../../common/systemcontants';
import {
  deleteCheckStandard,
  getCheckStandard,
  selectCheckStandard,
  selectLoading,
  selectSuccess,
  putCheckStandard,
} from '../../../../slices/checkStandard/checkStandardSlice';
import {CheckStandardModel} from '../../../../slices/checkStandard/checkStandardModel';
import CheckStandardForm from './CheckStandardForm';

export default function CheckStandardPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStandard, setEditingStandard] = useState(
    new CheckStandardModel(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [statusModal, setstatusModal] = useState(0);
  const [isView, setIsViewModal] = useState(false);
  const checkStandardes = useSelector(selectCheckStandard);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const isSuccess = useSelector(selectSuccess);

  useEffect(() => {
    dispatch(
      getCheckStandard({
        index: SystemContants.PAGE_INDEX,
        size: SystemContants.PAGE_SIZE,
      }),
    );
  }, [dispatch]);

  const onAddStandard = () => {
    setstatusModal(0);
    setIsEditing(true);
    setEditingStandard(new CheckStandardModel());
  };

  const resetEditing = (isReset = false) => {
    setIsEditing(false);
    setEditingStandard(new CheckStandardModel());
    if (isReset) {
      dispatch(
        getCheckStandard({index: currentPage, size: SystemContants.PAGE_SIZE}),
      );
    }
  };

  const paginationChange = (page, pageSize) => {
    setCurrentPage(page);
    dispatch(getCheckStandard({index: page, size: pageSize}));
  };

  useEffect(() => {
    if (isSuccess) {
      if (isEditing && statusModal === 1) {
        setCurrentPage(currentPage);
      } else {
        setCurrentPage(1);
      }
      dispatch(
        getCheckStandard({index: currentPage, size: SystemContants.PAGE_SIZE}),
      );
    }
  }, [isSuccess]);

  // useEffect(() => {}, [editingStandard]);

  const onEditStandard = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingStandard({...record});
    setIsViewModal(false);
  };
  const onViewStandard = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingStandard({...record});
    setIsViewModal(true);
  };

  const onChangeCheck = (checked, value) => {
    // =========================
    // xu ly value truoc khi gui
    // =========================

    const dataPutToServer = {
      name: value.name,
      rules: value.rules,
      description: value.description,
      status: Number(checked),
    };

    dispatch(putCheckStandard({data: dataPutToServer, id: value.id}));
  };
  const onDeleteStandard = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete this standard record?',
      okText: 'Yes',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteCheckStandard(record));
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
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (_, value) => {
        return (
          <Switch
            checked={!!value.status}
            onChange={(checked) => onChangeCheck(checked, value)}
          />
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => {
        return (
          <>
            <EyeOutlined
              onClick={() => {
                onViewStandard(record);
              }}
            />
            <EditOutlined
              onClick={() => {
                onEditStandard(record);
              }}
              style={{marginLeft: 12}}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStandard(record);
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
      <Button onClick={onAddStandard}>Add a new Standard</Button>
      <Table
        columns={columns}
        dataSource={checkStandardes?.result?.map((value) => {
          let statusToBoolean = false;
          if (value.status === 1) {
            statusToBoolean = true;
          }

          return {...value, key: value.id, rules: JSON.parse(value.value)};
        })}
        pagination={{
          pageSize: SystemContants.PAGE_SIZE,
          total: checkStandardes?.totalRecords,
          onChange: paginationChange,
          current: currentPage,
        }}
      ></Table>
      <CheckStandardForm
        resetEditing={resetEditing}
        isEditing={isEditing}
        editingStandard={editingStandard}
        isView={isView}
      />
    </Spin>
  );
}
