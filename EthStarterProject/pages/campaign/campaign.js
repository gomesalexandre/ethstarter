import React from 'react';
import PropTypes from 'prop-types';
import { Card, Breadcrumb, Button, Layout, Menu, Form, Input, } from 'antd';
import { nextConnect, } from '../../store/initStore';
import web3 from '../../ethereum/web3';
import { createRequest, } from '../../actions/createRequestAsync';
import { getAccounts, } from '../../actions/addAccountsAsync';
import PageLayout from '../../containers/Layout';
import RequestModal from '../../wrappers/RequestModal';
import { getCampaignSummary, } from '../../actions/getCampaignSummaryAsync';

class Campaign extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isRequestModalVisible: false,
    isContributeCardVisible: false,
    requestDescription: '',
    requestRecipient: '',
    requestValue: 0,
  }

  static getInitialProps ({ store, query, }) {
    store.dispatch({ type: 'GET_INITIAL_PROPS', });
    return { query, };
  }

  async componentDidMount() {
    await this.props.dispatch(getCampaignSummary(this.props.query.address));
    await this.props.dispatch(getAccounts(web3));
  }
  showRequestForm() {
    this.setState({isRequestCardVisible: true,});
  }
  showContributeForm() {
    this.setState({isContributeCardVisible: true, });
  }
  showRequestModal() {
    try {
      this.props.form.validateFields((err, values) =>{
        this.props.dispatch({
          type: 'SET_REQUEST_IN_STORE',
          payload: {
            requestDescription: values.requestDescription,
            requestRecipient: values.requestRecipient,
            requestValue: values.requestValue,
          },
        });

        this.setState({isRequestModalVisible: true,});
      });
    } catch(e) {throw e;}
  }
  async handleRequestOk() {
    await this.props.dispatch(createRequest(this.props.campaign.address, this.props.newRequest, this.props.accounts[0]));
  }

  render(){
    const { getFieldDecorator, } = this.props.form;
    const { loading, newRequest, } = this.props;
    const isRequestModalVisible = this.state.isRequestModalVisible;
    return(
      <PageLayout>
          <RequestModal
            isRequestModalVisible={isRequestModalVisible}
            handleRequestOk={() => this.handleRequestOk()}
            loading={loading}
            newRequest={newRequest}
          />
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Campaigns</a></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.address}</Breadcrumb.Item>
          </Breadcrumb>
            <Layout style={{"padding": "0 50px",}}>
             <Layout.Sider width={200} style={{ background: '#fff', }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1',]}
                  defaultOpenKeys={['sub1',]}
                  style={{ height: '100%', }}
                >
                  {/* <Menu.SubMenu key="requests" requests={() => this.props.requests}title={<span>Requests</span>}>
                    {[1,2,].map((x,i) => ( //TODO: Get actual requests !
                      <Menu.Item key={i} >Request number here</Menu.Item>
                    ))}
                  </Menu.SubMenu> */}
                </Menu>
              </Layout.Sider>
              <Layout.Content>
                <Card title="Campaign">
                  <Button type={this.state.isRequestCardVisible ? "primary" : "secondary"} icon="file" onClick={() => this.showRequestForm()}>Create new request</Button>
                  <Button type="secondary" icon="file" onClick={() => this.showContributeForm()}>Contribute</Button>
                  { this.state.isRequestCardVisible &&
                    <Card type="inner" title="New request">
                      <Form layout="inline">
                        <Form.Item label= "Description">
                          {getFieldDecorator('requestDescription', {
                            rules: [{ required: true, whitespace: true, },],
                            })(<Input />)
                          }
                        </Form.Item>
                        <Form.Item label= "Value">
                        {getFieldDecorator('requestValue', {
                            rules: [{ required: true, whitespace: true, },],
                            })(<Input />)
                        }
                        </Form.Item>
                        <Form.Item label= "Recipient">
                        {getFieldDecorator('requestRecipient', {
                            rules: [{ required: true, whitespace: true, },],
                            })(<Input />)
                        }
                        </Form.Item>
                        <Button type="primary" onClick={() => this.showRequestModal()}>Request</Button>
                      </Form>
                    </Card>
                  }
                  <Card type="inner" title="Address">{this.props.campaign.address}</Card>
                  <Card type="inner" title="Minimum Contribution">
                    {this.props.campaign.minimumContribution} wei ({web3.utils.fromWei(this.props.campaign.minimumContribution, 'ether')} ethers)
                  </Card>
                  <Card type="inner" title="Manager">{this.props.campaign.manager}</Card>
                  <Card type="inner" title="Contributers">{this.props.campaign.approversCount}</Card>
                  {/* <Card type="inner" title="Requests">{this.props.campaign.requests}</Card> */}
                </Card>
              </Layout.Content>
            </Layout>
      </PageLayout>
    );}
}

Campaign.propTypes = {
  dispatch: PropTypes.func,
  query: PropTypes.obj,
  form: PropTypes.obj,
  campaign: PropTypes.obj,
  newRequest: PropTypes.obj,
  accounts: PropTypes.arr,
  loading: PropTypes.bool,
  address: PropTypes.string,

};
const ParsedCampaign = Form.create({})(Campaign);
export default nextConnect(state => state)(ParsedCampaign);
