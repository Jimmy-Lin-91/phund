import React from 'react';
import "antd/dist/antd.css";
import { Layout, Menu  } from "antd";
import { Router, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../helpers';
import { userActions } from '../actions';
import SVG from './SVG'

const { Header, Footer, Content} = Layout;

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.props.logout();
  }
  render() {
    return (
      <div>
          <Router history={history}>
          <Layout>
              <Header>
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                      <Menu.Item key="1"><Link to='/login'>login</Link></Menu.Item>
                      <Menu.Item key="2"><Link to='/register'>register</Link></Menu.Item>
                  </Menu>
              </Header>
              <Content>DIV 1</Content>
              <Content>DIV 2</Content>
              <Content>DIV 3</Content>
              <Content>DIV 4</Content>
              <Content>
                  <div style = {{
                      width: "1680px",
                      height: "1126px",
                      left: "0px",
                      top: "4274px",
                      background: "#FFFFFF"
                  }}></div>

              </Content>
              <Footer>Footer</Footer>
            </Layout>
          </Router>
      </div>
    );
  }
}

function mapState(state) {
  const { loggedIn } = state.authentication;
  return { loggedIn };
}

const actionCreators = {
  logout: userActions.logout
};

const connectedLanding = connect(mapState, actionCreators)(Landing);
export { connectedLanding as Landing };
