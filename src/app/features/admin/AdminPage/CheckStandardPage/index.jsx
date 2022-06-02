import React, {useEffect, useState} from 'react';
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
  const [isView, setIsViewModal] = useState(true);
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

  useEffect(() => {}, [editingStandard]);

  const onEditStandard = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingStandard({...record});
  };
  const onViewStandard = (record) => {
    setstatusModal(1);
    setIsEditing(true);
    setEditingStandard({...record});
    setIsViewModal(true);
  };

  const handleTestApi = async () => {
    try {
      // const index = 1;
      // const size = 10;
      // const reponse = await api.get(
      //   `/CheckStandard?PageNumber=${index}&PageSize=${size}`,
      // );

      const myapi = axios.create({
        baseURL: 'https://jsonplaceholder.typicode.com',
      });
      const reponse = await myapi.get(`/comments?postId=1&id=1`);
      console.log(reponse);

      // const result = reponse.data.result;
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
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
      render: () => {
        return <Switch defaultChecked />;
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
      <Button onClick={handleTestApi}>test api</Button>
      <Table
        columns={columns}
        dataSource={checkStandardes?.result?.map((value) => {
          let name = 'Base';
          if (value.type !== 1) {
            name = 'Function';
          }
          return {...value, typeName: name, key: value.id};
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
