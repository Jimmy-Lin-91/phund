import React from 'react'
import {Row, Col, Card, Avatar} from 'antd'

import { EditOutlined, EllipsisOutlined, SettingOutlined, GithubOutlined, AntDesignOutlined, AmazonOutlined } from '@ant-design/icons';
import RightSideTriangle from '../DivSixComponents/RSTriangleSVG'
import LeftSideTriangle from '../DivSixComponents/triangleIcon'




function DivFive() {
    const {Meta} = Card
    return(
        <>
         <Row
            align="middle"
        >
            <Col
            lg={8}
            >
            </Col>
            <Col
            lg={8}
            style={{justifyItems: 'center'}}
            >
               <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: '70px'}}
                >     
                    <h1>
                    Latest Articles
                    </h1>
                </div>
                <div
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"}}
                >
                    <h2
                    style={{justifyItems: 'center', fontSize: '18px'}}
                    >
                    Learn more about all things finance
                    </h2> 
                </div>
            </Col>
            <Col
                lg={8}
            >
            </Col>
            </Row>
            <Row
            style={{marginBottom: '50px'}}
            >
                <Col
                lg={3}
                >
                <LeftSideTriangle></LeftSideTriangle>
                </Col>
                <Col
                lg={6}
                >
                <Card
                    style={{ width: 300 }}
                    cover={
                    <img src={require('../Landing/Assets/SVG/MainPhundImage.svg')} />
                    }
                    
                    >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Hello"
                    description="This is the description"
                    />
                    </Card>
                </Col>
                <Col
                lg={6}
                >
                    <Card
                    style={{ width: 300 }}
                    cover={
                    <img src={require('../Landing/Assets/SVG/MainPhundImage.svg')} />
                    }
                    
                    >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                    </Card>
                </Col>
                <Col
                lg={6}
                >
                    <Card
                    style={{ width: 300 }}
                    cover={
                    <img src={require('../Landing/Assets/SVG/MainPhundImage.svg')} />
                    }
                    
                    >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                    </Card>
                </Col>
                <Col
                lg={3}
                >
                
                </Col>
                
            </Row>
            <Row
            style={{justifyContent: 'center'}}
            >
               
                    <p
                    style={{fontWeight:'bold', fontSize: '30px', color: '#2A2958'}}
                    >
                        Our Partners
                    </p>
                
            </Row>
            <Row
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"}}
            align='middle'
            >
                <Col
                lg={4}
                >
                
                </Col>
                <Col
                lg={5}
                style={{fontSize: '40px', textAlign: 'center', color: '#4E668A', opacity: '0.4'}}
                >
                    Stripe
                        <Row
                        align='middle'
                        >
                            <Col
                            lg={24}
                            >
                                <div style={{textAlign: 'center'}}>
                                    <GithubOutlined></GithubOutlined>
                                </div>
                            
                                
                            </Col>
                        
                        </Row>
                        
                        
                </Col>
                <Col
                lg={5}
                style={{fontSize: '40px', textAlign: 'center', color: '#4E668A', opacity: '0.4'}}
                >
                    Ant Design
                        <Row>
                            <Col
                            lg={24}
                            style={{textAlign: 'center'}}
                            >
                                <div>
                                    <AntDesignOutlined></AntDesignOutlined>
                                </div>
                                
                            </Col>
                        </Row>
                        
                        
                </Col>
                <Col
                lg={5}
                style={{fontSize: '40px', textAlign: 'center', color: '#4E668A', opacity: '0.4'}}
                >

                    Amazon  
                    <Row>
                            <Col
                            lg={24}
                            style={{textAlign: 'center'}}
                            >
                                <div>
                                    <AmazonOutlined></AmazonOutlined>
                                                                    </div>
                                
                            </Col>
                        </Row>
                </Col>
                <Col
                lg={3}
                >
                </Col>
                <Col
                lg={2}
                >
                    <RightSideTriangle></RightSideTriangle>
                </Col>
            </Row>
            
                
               
        
</>
    )
}
export default DivFive