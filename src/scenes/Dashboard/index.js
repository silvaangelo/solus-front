import './style.css';
import React from 'react';
import moment from 'moment';
import TopMenu from '../menu';
import * as axios from 'axios';
import columns from './columns';
import { API_ROUTES, API_HEADERS } from '../../api';
import { notifyWithIcon } from '../helpers/notification';
import { Layout, Row, Col, Divider, Select, Form, InputNumber, DatePicker, Button, List } from 'antd';
import { LineChart, CartesianGrid, Tooltip, Line, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

class Dashboard extends React.Component {
  chartRef;

  constructor(props) {
    super(props);

    document.title = 'Solus | Dashboard';

    this.chartRef = React.createRef();

    this.state = {
      loading: true,
      loadingStatistic: false,
      isStatisticLoaded: false,
      arduinos: [],
      data: []
    };
  }

  getArduinos = async (e) => {
    try {
      const res = await axios.get(API_ROUTES.arduino, API_HEADERS);

      return res.data.data.map(arduino => {
        arduino.key = arduino._id;
        arduino.id = arduino._id;

        return arduino;
      });
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um erro ao carregar os arduinos.');
    }
  }

  getStatistic = async (values) => {
    try {
      const res = await axios.get(`${API_ROUTES.statistic}/${values.arduino}`, {
        params: {
          from: values.range[0].format('YYYY-MM-DD HH:mm'),
          to: values.range[1].format('YYYY-MM-DD HH:mm'),
          interval: `${values.intervalValue}${values.intervalGrandeur}`
        },
        headers: API_HEADERS.headers
      });

      if(!res.data.data.min) {
        return {
          averages: [],
          minMax: []
        }
      }

      const [averages, minMax] = await Promise.all([
        res.data.data.statistic.map(e => {
          e.date = moment(e._id).local().format('HH:mm DD/MM/YYYY');
          e.ambienceTemperature = parseInt(e.ambienceTemperature);
          e.rainfall = parseInt(e.rainfall);
          e.sunCapability = parseInt(e.sunCapability);
          e.humidity = parseInt(e.humidity);
          e.temperatureHumidity = parseInt(e.temperatureHumidity);
          e.lightIntensity = parseInt(e.lightIntensity);
  
          return e;
        }),
        columns.map(c => {
          return {
            key: c.key,
            min: c.show(parseInt(res.data.data.min[c.key])),
            max: c.show(parseInt(res.data.data.max[c.key])),
            text: c.text,
            color: c.color
          }
        })
      ]);

      return {
        averages: averages.reverse(),
        minMax: minMax
      };
    } catch (e) {
      notifyWithIcon('error', 'Ocorreu um ero ao carregar as estatísticas, por favor, tente novamente mais tarde.');
    }
  }

  loadStatistic = async (e) => {
    e.preventDefault();
    this.setState({
      loadingStatistic: true
    });

    this.props.form.validateFields(async (err, values) => {
      if(err) {
        return;
      }

      const data = await this.getStatistic(values);

      this.setState({
        data: data,
        isStatisticLoaded: true,
        loadingStatistic: false
      });
    });
  }
  
  async componentWillMount() {
    this.setState({
      loading: false,
      arduinos: await this.getArduinos()
    });
  }

  charts = () => {
    return (
      <React.Fragment>
      {this.state.isStatisticLoaded && this.state.data.minMax.length > 0 &&
        <React.Fragment>
          <Divider/>
      
          <Row>
            <Col span={24}>
              <h2>Resultados:</h2>
            </Col>
          </Row>

          <Divider/>

          <Row>
            <Col span={24}>
              <h3>Mínimas e Máximas:</h3>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <List
                className="measures"
                dataSource={this.state.data.minMax}
                renderItem={item => (<List.Item><b style={{color: item.color}}>{item.text}:</b>{item.min}<span className="text-divisor">|</span>{item.max}</List.Item>)}
              />
            </Col>
          </Row>

          <Divider/>

          <Row>
            <Col span={24}>
              <h3>Gráficos:</h3>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <ResponsiveContainer width="100%" height={350} ref={this.chartRef}>
                <LineChart data={this.state.data.averages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {columns.map(c => {
                    return (<Line name={c.text} key={c.key} type="monotone" dataKey={c.key} stroke={c.color} />)
                  })}
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </React.Fragment>
      }
      </React.Fragment>
    );
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { RangePicker } = DatePicker;

    const Charts = this.charts;

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
                <h2>Filtros:</h2>
              </Col>
            </Row>

            <Row>
              <Form onSubmit={this.loadStatistic}>
                <Row>
                  <Col xs={24} lg={7} sm={7} md={7}>
                    <Form.Item>
                      {getFieldDecorator('arduino', {
                        rules: [{ required: true, message: 'Por favor escolha o arduino.' }]
                      }) (
                        <Select placeholder="Arduino">
                          {this.state.arduinos.map(e => {
                            return (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>);
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} lg={24} sm={24} md={24}>
                    <Form.Item style={{maxWidth: "100%"}}>
                      {getFieldDecorator('range', {
                        rules: [{ required: true, message: 'Por favor escolha a data inicial e a data limite.' }]
                      }) (
                        <RangePicker placeholder={["De", "Até"]} showTime format="YYYY-MM-DD HH:mm:ss" required />
                      )}
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={7} lg={2} sm={2} md={2}>
                    <Form.Item>
                      {getFieldDecorator('intervalValue', {
                        rules: [{ required: true, message: 'Por favor escolha o intervalo.' }]
                      }) (
                        <InputNumber min={1} placeholder="Intervalo" />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={17} lg={2} sm={2} md={2}>
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
                
                <Form.Item>
                  <Button type="primary" loading={this.state.loadingStatistic} htmlType="submit">Buscar</Button>
                </Form.Item>
              </Form>
            </Row>

            <Charts />
          </Layout>
        </div>
      </div>
    )
  }
}

const FormDashboard = Form.create()(Dashboard);

export default FormDashboard