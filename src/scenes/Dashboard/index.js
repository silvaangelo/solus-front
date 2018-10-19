import React from 'react';
import TopMenu from '../menu';
import { Layout, Row, Col, Divider, Select, Form, InputNumber, DatePicker, Button } from 'antd';
import * as axios from 'axios';
import { API_ROUTES, API_HEADERS } from '../../api';
import { notifyWithIcon } from '../helpers/notification'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Solus | Dashboard';

    this.state = {
      loading: true,
      data: []
    };
  }

  getArduinos = async (e) => {
    try {
      const res = await axios.get(API_ROUTES.arduino, API_HEADERS);

      return res.data.data.map(arduino => {
        return {
          key: arduino._id,
          id: arduino._id,
          name: arduino.name,
          location: arduino.location,
          createdAt: arduino.createdAt,
          updatedAt: arduino.updatedAt
        };
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar os arduinos.');
    }
  }

  getStatistic = async (values) => {
    try {
      const res = await axios.get(`${API_ROUTES.statistic}/${values.arduino}`, {
        params: {
          from: values.range[0].format('YYYY-MM-DD HH:mm'),
          to: values.range[1].format('YYYY-MM-DD HH:mm'),
          interval: `${values.intervalValue}${values.intervalGrandeur}`,
          skip: 0,
          limit: 100
        },
        headers: API_HEADERS.headers
      });

      console.log(res);
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar as estatísticas, por favor, tente novamente mais tarde.');
    }
  }

  loadStatistic = async (e) => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      await this.getStatistic(values);
    });
  }
  
  async componentWillMount() {
    this.setState({
      loading: false,
      data: await this.getArduinos()
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { RangePicker } = DatePicker;

    return (
      <div>
        <TopMenu></TopMenu>

        <div id={"root-with-header"}>
          <Layout className="no-background">
            <Row>
              <Col span={24}>
                <h1>Dashboard</h1>
                <Divider/>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <h2>Busque os dados:</h2>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Form onSubmit={this.loadStatistic}>
                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        {getFieldDecorator('arduino', {
                          rules: [{ required: true, message: 'Por favor escolha o arduino.' }]
                        }) (
                          <Select placeholder="Arduino">
                            {this.state.data.map(e => {
                              return (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>);
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        {getFieldDecorator('range', {
                          rules: [{ required: true, message: 'Por favor escolha a data inicial e a data limite.' }]
                        }) (
                          <RangePicker placeholder={["Data inicial", "Data final"]} showTime format="YYYY-MM-DD HH:mm:ss" required />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <span>
                    <Row>
                      <Col span={8}>
                        <Form.Item>
                          {getFieldDecorator('intervalValue', {
                            rules: [{ required: true, message: 'Por favor escolha o intervalo.' }]
                          }) (
                            <InputNumber min={0} placeholder="Intervalo" />
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={16}>
                        <Form.Item>
                          {getFieldDecorator('intervalGrandeur', {
                            rules: [{ required: true, message: 'Por favor escolha a grandeza de intervalo.' }]
                          }) (
                            <Select placeholder="Grandeza">
                              <Select.Option value='d'>Dia</Select.Option>
                              <Select.Option value='m'>Mês</Select.Option>
                              <Select.Option value='y'>Ano</Select.Option>
                              <Select.Option value='h'>Hora</Select.Option>
                              <Select.Option value='i'>Minuto</Select.Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </span>
                  
                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">Buscar</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Layout>
        </div>
      </div>
    )
  }
}

const FormDashboard = Form.create()(Dashboard);

export default FormDashboard