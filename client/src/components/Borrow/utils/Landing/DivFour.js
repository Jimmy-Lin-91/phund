import React from 'react'
import {Row, Col, List, Button} from 'antd'

function DivFour() {
    const data = [
        {
          title: 'What is Phund?',
        },
        {
          title: 'How can using Phund save me money?',
        },
        {
          title: 'What is the catch?',
        },
        {
          title: 'Is this secure?',
        },
      ];
      const Buttonstyles = {
        marginTop:"10",
        paddingTop: "15",
        paddingBottom: "15",
        marginLeft: "30",
        marginRight: "30",
        backgroundColor:'#F7CBD0',
        borderRadius: "25px",
        borderWidth: "1",
        }

return (
            <>
            <Row
            style={{marginTop: '50px'}}
            >
                <Col
                span={3}
                >
                </Col>
                <Col
                span={4}
                >
                    <Row>
                        <Col
                        span={24}
                        >
                            <div>
                                <h1
                                style={{color: '#FFFFFF', fontWeight: 'bolder'}}
                                >
                                    FAQ
                                </h1>
                                <p>
                                    Find answers to your questions here
                                </p>
                                <p>
                                    Still can't find the answers?
                                </p>
                                <div
                                style={{marginBottom: '50px'}}
                                >
                                    <Button
                                    
                                    style={Buttonstyles}>
                                        Contact Us
                                    </Button>
                                </div>
                                
                            </div>
                            <div>
                            <img src={require('../Landing/Assets/SVG/Airplane.svg')} />
                            </div>   
                        </Col>
                    </Row>
                    
                </Col>
                <Col
                span={2}
                >
                </Col>
                <Col
                span={12}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                        <List.Item>
                        <List.Item.Meta
                        title={<a href="https://ant.design">{item.title}</a>}
                        
                        />
                        </List.Item>
                             )}
                    />,   
                </Col>
                <Col
                span={2}
                >
                </Col>
            </Row>
            </>

        )
    }
 export default DivFour