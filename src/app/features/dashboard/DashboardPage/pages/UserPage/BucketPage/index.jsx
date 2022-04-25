import React from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Row, Space, Tree  } from 'antd';
import Viewer from './Viewer';

const { DirectoryTree } = Tree;

const treeData = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

function BucketPage(props) {

    const onSelect = (keys, info) => {
        console.log('Trigger Select', keys, info);
      };
    
      const onExpand = () => {
        console.log('Trigger Expand');
      };

  return (
      <Row>
          
          <Col span={4}>
            <Card title="Your Buckets" style={{marginRight: 24}}>
                    <DirectoryTree
                    multiple
                    defaultExpandAll
                    onSelect={onSelect}
                    onExpand={onExpand}
                    treeData={treeData}
                />
            </Card>
        </Col>
        <Col span={20}>
            <Card title="Viewer">
                <Viewer />
            </Card>
        </Col>
        
        </Row>
       

  )
}

BucketPage.propTypes = {}

export default BucketPage
