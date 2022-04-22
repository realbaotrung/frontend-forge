import { useEffect  } from "react";
import {useDispatch,useSelector} from 'react-redux';
import {Typography, Space, Tree } from "antd";
import { DownOutlined } from '@ant-design/icons';
import {selectValue,setValue, selectDataTree} from '../../../../../../../slices/testSlice/testSlice';


// eslint-disable-next-line react/prop-types
export default function ResultData() {
  const dispatch = useDispatch();
  const dataTree = useSelector(selectDataTree);
  const autoExpandParent = true;
  const onSelect = (selectedKeys, info) => {
    if(info.selected && info.selectedNodes[0].children !== undefined)
      {
        dispatch(setValue(info.selectedNodes[0].title));
      }
  };
  const {Text} = Typography;
  useEffect(()=>{
    
    },[dataTree]);

  return (
    <Space size={[0, 8]} direction='vertical' align="20 0 0 0">
      <Text>Categories</Text>
      <Tree
        className="customTree"
        switcherIcon={<DownOutlined />}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        treeData={dataTree}
      />
    </Space>
  );
  
}
